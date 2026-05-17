package com.example.tmdt.service;

import com.example.tmdt.config.VNPayConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VNPayService {
    @Value("${payment.vnpay.mock-enabled:true}")
    private boolean mockEnabled;

    @Value("${payment.vnpay.pay-url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String payUrl;

    @Value("${payment.vnpay.return-url:http://localhost:3000/pay-success}")
    private String returnUrl;

    @Value("${payment.vnpay.tmn-code:I8QN1DFX}")
    private String tmnCode;

    @Value("${payment.vnpay.secret-key:VIJ0NDAYKJ5OL7I9LIV1T5IYZJ35KR8X}")
    private String secretKey;

    @Transactional
    public String create_payment(BigDecimal amounts) throws UnsupportedEncodingException {
        String vnp_TxnRef = VNPayConfig.getRandomNumber(8);

        if (mockEnabled) {
            return buildMockSuccessUrl(vnp_TxnRef);
        }

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        BigDecimal amount = amounts.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP);
        String vnp_IpAddr = "42.118.208.78";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", tmnCode);
        vnp_Params.put("vnp_Amount", amount.toPlainString());
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");

        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return payUrl + "?" + queryUrl;
    }

    private String buildMockSuccessUrl(String txnRef) throws UnsupportedEncodingException {
        String separator = returnUrl.contains("?") ? "&" : "?";
        return returnUrl
                + separator
                + "vnp_ResponseCode=00"
                + "&mock=true"
                + "&vnp_TxnRef=" + URLEncoder.encode(txnRef, StandardCharsets.UTF_8.toString());
    }
}
