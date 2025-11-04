import React from 'react';
import { Table } from 'react-bootstrap';

interface InvoiceItem {
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceProps {
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: InvoiceItem[];
  totalAmount: number;
  orderDate?: string;
}

const Invoice: React.FC<InvoiceProps> = ({
  orderNumber = 'N/A',
  customerName,
  customerEmail,
  customerPhone,
  deliveryAddress,
  items,
  totalAmount,
  orderDate = new Date().toLocaleString('vi-VN'),
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="invoice-container" id="invoice-print">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-print, #invoice-print * {
            visibility: visible;
          }
          #invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
        
        .invoice-container {
          background: white;
          padding: 30px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .invoice-header {
          text-align: center;
          border-bottom: 3px solid #23854D;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .invoice-header h1 {
          color: #23854D;
          font-size: 2.5rem;
          margin: 0;
          font-weight: bold;
        }
        
        .invoice-header .company-name {
          font-size: 1.8rem;
          color: #333;
          margin-top: 5px;
        }
        
        .invoice-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        
        .invoice-section {
          flex: 1;
        }
        
        .invoice-section h5 {
          color: #23854D;
          font-weight: bold;
          margin-bottom: 10px;
          border-bottom: 2px solid #FFD34C;
          padding-bottom: 5px;
        }
        
        .invoice-section p {
          margin: 5px 0;
          color: #333;
        }
        
        .invoice-table {
          margin: 30px 0;
        }
        
        .invoice-table th {
          background: #23854D;
          color: white;
          padding: 12px;
          text-align: left;
        }
        
        .invoice-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #ddd;
        }
        
        .invoice-total {
          text-align: right;
          margin-top: 20px;
        }
        
        .invoice-total-row {
          display: flex;
          justify-content: flex-end;
          margin: 10px 0;
        }
        
        .invoice-total-label {
          width: 200px;
          text-align: right;
          padding-right: 20px;
          font-weight: bold;
        }
        
        .invoice-total-value {
          width: 150px;
          text-align: right;
        }
        
        .invoice-grand-total {
          font-size: 1.5rem;
          color: #23854D;
          font-weight: bold;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 2px solid #23854D;
        }
        
        .invoice-footer {
          margin-top: 50px;
          text-align: center;
          color: #666;
          border-top: 2px solid #FFD34C;
          padding-top: 20px;
        }
        
        .invoice-signature {
          display: flex;
          justify-content: space-around;
          margin-top: 50px;
        }
        
        .signature-box {
          text-align: center;
        }
        
        .signature-line {
          width: 200px;
          border-top: 1px solid #333;
          margin: 50px auto 10px;
        }
      `}</style>

      <div className="invoice-header">
        <div className="company-name">🛒 FreshMart</div>
        <h1>HÓA ĐƠN BÁN HÀNG</h1>
        <p style={{ margin: '10px 0', fontSize: '1.1rem' }}>
          Địa chỉ: Đại học FPT, Hà Nội
        </p>
        <p style={{ margin: '5px 0' }}>
          Điện thoại: 0399999999 | Email: contact@freshmart.vn
        </p>
      </div>

      <div className="invoice-info">
        <div className="invoice-section">
          <h5>📋 THÔNG TIN ĐỀN HÀN</h5>
          <p><strong>Mã đơn hàng:</strong> {orderNumber}</p>
          <p><strong>Ngày đặt:</strong> {orderDate}</p>
          <p><strong>Trạng thái:</strong> Đang xử lý</p>
        </div>

        <div className="invoice-section">
          <h5>👤 THÔNG TIN KHÁCH HÀNG</h5>
          <p><strong>Họ tên:</strong> {customerName}</p>
          <p><strong>Email:</strong> {customerEmail}</p>
          <p><strong>Điện thoại:</strong> {customerPhone}</p>
          <p><strong>Địa chỉ:</strong> {deliveryAddress}</p>
        </div>
      </div>

      <div className="invoice-table">
        <Table bordered>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>STT</th>
              <th>Tên sản phẩm</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Số lượng</th>
              <th style={{ width: '150px', textAlign: 'right' }}>Đơn giá</th>
              <th style={{ width: '150px', textAlign: 'right' }}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td>{item.productName}</td>
                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{formatPrice(item.price)}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  {formatPrice(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="invoice-total">
        <div className="invoice-total-row">
          <div className="invoice-total-label">Tạm tính:</div>
          <div className="invoice-total-value">{formatPrice(totalAmount)}</div>
        </div>
        <div className="invoice-total-row">
          <div className="invoice-total-label">Phí vận chuyển:</div>
          <div className="invoice-total-value" style={{ color: '#23854D' }}>Miễn phí</div>
        </div>
        <div className="invoice-total-row">
          <div className="invoice-total-label">Giảm giá:</div>
          <div className="invoice-total-value">0 ₫</div>
        </div>
        <div className="invoice-total-row invoice-grand-total">
          <div className="invoice-total-label">TỔNG CỘNG:</div>
          <div className="invoice-total-value">{formatPrice(totalAmount)}</div>
        </div>
      </div>

      

      <div className="invoice-footer">
        <p style={{ marginBottom: '10px', fontSize: '1.1rem', fontWeight: 'bold' }}>
          🎉 Cảm ơn quý khách đã mua hàng tại FreshMart! 🎉
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          Mọi thắc mắc xin vui lòng liên hệ hotline: <strong>1900-xxxx</strong>
        </p>
        <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '10px' }}>
          Hóa đơn được in tự động từ hệ thống FreshMart
        </p>
      </div>
    </div>
  );
};

export default Invoice;

