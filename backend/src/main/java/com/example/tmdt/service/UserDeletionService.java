package com.example.tmdt.service;

import com.example.tmdt.model.ChatMessage;
import com.example.tmdt.model.ChatSession;
import com.example.tmdt.model.Coupon;
import com.example.tmdt.model.Order;
import com.example.tmdt.model.Role;
import com.example.tmdt.model.User;
import com.example.tmdt.repository.BalanceTransactionRepository;
import com.example.tmdt.repository.ChatMessageRepository;
import com.example.tmdt.repository.ChatSessionRepository;
import com.example.tmdt.repository.CouponRepository;
import com.example.tmdt.repository.OrderRepository;
import com.example.tmdt.repository.ReviewHelpfulRepository;
import com.example.tmdt.repository.ReviewRepository;
import com.example.tmdt.repository.ShipmentTrackingRepository;
import com.example.tmdt.repository.UserBalanceRepository;
import com.example.tmdt.repository.UserRepository;
import com.example.tmdt.repository.WishlistRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserDeletionService {

    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    private final ReviewHelpfulRepository reviewHelpfulRepository;
    private final ReviewRepository reviewRepository;
    private final WishlistRepository wishlistRepository;
    private final BalanceTransactionRepository balanceTransactionRepository;
    private final UserBalanceRepository userBalanceRepository;
    private final OrderRepository orderRepository;
    private final ShipmentTrackingRepository shipmentTrackingRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;

    public UserDeletionService(
            UserRepository userRepository,
            CouponRepository couponRepository,
            ReviewHelpfulRepository reviewHelpfulRepository,
            ReviewRepository reviewRepository,
            WishlistRepository wishlistRepository,
            BalanceTransactionRepository balanceTransactionRepository,
            UserBalanceRepository userBalanceRepository,
            OrderRepository orderRepository,
            ShipmentTrackingRepository shipmentTrackingRepository,
            ChatSessionRepository chatSessionRepository,
            ChatMessageRepository chatMessageRepository) {
        this.userRepository = userRepository;
        this.couponRepository = couponRepository;
        this.reviewHelpfulRepository = reviewHelpfulRepository;
        this.reviewRepository = reviewRepository;
        this.wishlistRepository = wishlistRepository;
        this.balanceTransactionRepository = balanceTransactionRepository;
        this.userBalanceRepository = userBalanceRepository;
        this.orderRepository = orderRepository;
        this.shipmentTrackingRepository = shipmentTrackingRepository;
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName() == Role.ERole.ROLE_ADMIN);
        if (isAdmin) {
            throw new IllegalArgumentException("Admin users cannot be deleted");
        }

        detachCoupons(user);
        reviewHelpfulRepository.deleteAll(reviewHelpfulRepository.findByUser(user));
        reviewRepository.deleteAll(reviewRepository.findByUser(user));
        wishlistRepository.deleteAll(wishlistRepository.findByUser(user));
        balanceTransactionRepository.deleteAll(balanceTransactionRepository.findByUser(user));
        userBalanceRepository.findByUser(user).ifPresent(userBalanceRepository::delete);

        List<Order> orders = orderRepository.findByUserId(userId);
        for (Order order : orders) {
            shipmentTrackingRepository.deleteAll(
                    shipmentTrackingRepository.findByOrderIdOrderByCreatedAtDesc(order.getId()));
        }

        deleteChatData(userId.toString());
        userRepository.delete(user);
        userRepository.flush();
    }

    private void detachCoupons(User user) {
        List<Coupon> coupons = couponRepository.findByUsersContaining(user);
        for (Coupon coupon : coupons) {
            coupon.getUsers().removeIf(couponUser -> couponUser.getId().equals(user.getId()));
        }
        couponRepository.saveAll(coupons);
    }

    private void deleteChatData(String userId) {
        List<ChatSession> sessions = chatSessionRepository.findByUserIdOrderByStartedAtDesc(userId);
        Map<Long, ChatMessage> messages = new LinkedHashMap<>();

        for (ChatSession session : sessions) {
            for (ChatMessage message :
                    chatMessageRepository.findByChatSessionIdOrderByCreatedAtAsc(session.getId())) {
                messages.put(message.getId(), message);
            }
        }
        for (ChatMessage message : chatMessageRepository.findByUserIdOrderByCreatedAtDesc(userId)) {
            messages.put(message.getId(), message);
        }

        chatMessageRepository.deleteAll(messages.values());
        chatSessionRepository.deleteAll(sessions);
    }
}
