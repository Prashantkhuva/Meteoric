import 'package:flutter/material.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';

import 'api_client.dart';
import 'toast.dart';

/// Handles Razorpay checkout for INR invoice payments.
///
/// Flow:
/// 1. createOrder → get order_id from server
/// 2. openCheckout → user pays in Razorpay SDK
/// 3. onSuccess → verifyPayment via server → invoice marked paid + email sent
class RazorpayService {
  RazorpayService._();
  static final instance = RazorpayService._();

  // Test key — matches NEXT_PUBLIC_RAZORPAY_KEY_ID in .env
  // TODO: fetch from server config for production
  static const _keyId = 'rzp_test_TFNbkaPY2scxwT';

  final _razorpay = Razorpay();
  VoidCallback? _onSuccess;
  void Function(String)? _onError;

  void init({required VoidCallback onSuccess, required void Function(String) onError}) {
    _onSuccess = onSuccess;
    _onError = onError;
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handleSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handleError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  void dispose() {
    _razorpay.clear();
    _onSuccess = null;
    _onError = null;
  }

  /// Create a Razorpay order and open the checkout sheet.
  Future<void> pay({
    required BuildContext context,
    required int invoiceId,
    required String invoiceNumber,
    required num amount,
    required String currency,
    required String customerName,
    String? customerEmail,
    String? customerPhone,
  }) async {
    // Create order on server
    final res = await ApiClient.instance.razorpayCreateOrder(
      amount: amount,
      currency: currency,
      receipt: invoiceNumber,
    );

    final orderId = res['order_id'] as String?;
    if (orderId == null) {
      final error = res['error'] as String? ?? 'Failed to create order';
      if (context.mounted) Toast.error(context, error);
      return;
    }

    final options = {
      'key': _keyId,
      'amount': res['amount'],
      'currency': res['currency'] ?? currency,
      'name': 'Meteoric',
      'order_id': orderId,
      'description': 'Invoice $invoiceNumber',
      'prefill': {
        'contact': customerPhone ?? '',
        'email': customerEmail ?? '',
        'name': customerName,
      },
      'theme': {
        'color': '#EAEFFF',
      },
    };

    try {
      _razorpay.open(options);
    } catch (err) {
      if (context.mounted) Toast.error(context, err.toString());
    }
  }

  void _handleSuccess(PaymentSuccessResponse response) async {
    try {
      // Extract invoice_id from the receipt we passed when creating the order
      // The server already has it from the order creation
      final res = await ApiClient.instance.razorpayVerifyPayment(
        orderId: response.orderId ?? '',
        paymentId: response.paymentId ?? '',
        signature: response.signature ?? '',
      );
      if (res['error'] != null) {
        _onError?.call(res['error'] as String);
        return;
      }
      _onSuccess?.call();
    } catch (err) {
      _onError?.call(err.toString());
    }
  }

  void _handleError(PaymentFailureResponse response) {
    final message = response.message ?? 'Payment failed';
    _onError?.call(message);
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    // External wallet selected — no special handling needed
  }
}
