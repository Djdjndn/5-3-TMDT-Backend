export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value?: string) => {
  if (!value) return 'Không rõ';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
};

export const getStatusLabel = (status?: string) => {
  const map: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    PROCESSING: 'Đang xử lý',
    READY_TO_SHIP: 'Sẵn sàng giao',
    IN_TRANSIT: 'Đang giao',
    OUT_FOR_DELIVERY: 'Đang giao',
    DELIVERED: 'Đã giao',
    COMPLETED: 'Hoàn tất',
    CANCELLED: 'Đã hủy',
    RETURNED: 'Đã hoàn',
  };
  return status ? map[status] || status : 'Không rõ';
};
