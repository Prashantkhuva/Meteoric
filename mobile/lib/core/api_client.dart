import 'dart:convert';
import 'package:http/http.dart' as http;
import 'supabase.dart';
import 'config.dart';

/// Thin JSON client for the Meteoric admin API layer
/// (`app/api/admin/*` on the website). Authenticates with the Supabase
/// session's access token as a Bearer token.
class ApiException implements Exception {
  ApiException(this.message, {this.status = 400});
  final String message;
  final int status;
  @override
  String toString() => message;
}

class ApiClient {
  static final ApiClient instance = ApiClient._();

  ApiClient._();

  String get _base => AppConfig.apiBaseUrl;

  /// Supabase project ref from the URL (e.g. `abc123` in
  /// `https://abc123.supabase.co`) — used for the session cookie name.
  String? get _projectRef {
    final url = AppConfig.supabaseUrl
        .replaceFirst('https://', '')
        .replaceFirst('http://', '');
    return url.split('.').first;
  }

  Map<String, String> _headers() {
    final token = AuthService.accessToken;
    if (token == null) {
      throw ApiException('Not authenticated', status: 401);
    }
    final headers = {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    final ref = _projectRef;
    final session = AuthService.instance.auth.currentSession;
    if (ref != null && ref.isNotEmpty && session != null) {
      headers['Cookie'] =
          'sb-$ref-auth-token=base64-${base64Url.encode(utf8.encode(jsonEncode(session.toJson())))}';
    }
    return headers;
  }

  /// Sends the request; on a 401 the session is refreshed once and the
  /// request retried with the new access token.
  Future<http.Response> _send(Future<http.Response> Function() request) async {
    var res = await request();
    if (res.statusCode == 401 && AuthService.isSignedIn) {
      if (await AuthService.refreshSession()) {
        res = await request();
      }
    }
    return res;
  }

  Future<Map<String, dynamic>> _post(String path, Map<String, dynamic> body) async {
    final res = await _send(() => http.post(
          Uri.parse('$_base$path'),
          headers: _headers(),
          body: jsonEncode(body),
        ).timeout(const Duration(seconds: 30)));

    return _decode(res);
  }

  Future<Map<String, dynamic>> _get(String path) async {
    final res = await _send(() => http.get(
          Uri.parse('$_base$path'),
          headers: _headers(),
        ).timeout(const Duration(seconds: 30)));
    return _decode(res);
  }

  Map<String, dynamic> _decode(http.Response res) {
    Map<String, dynamic> body;
    try {
      body = jsonDecode(res.body) as Map<String, dynamic>;
    } catch (_) {
      throw ApiException('Unexpected server response (${res.statusCode})', status: res.statusCode);
    }
    if (res.statusCode == 401) {
      throw ApiException(body['error'] ?? 'Session expired', status: 401);
    }
    if (body.containsKey('error')) {
      throw ApiException(body['error'] as String, status: res.statusCode);
    }
    return body;
  }

  // ── Leads ────────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> leadsList(Map<String, dynamic> params) =>
      _post('/api/admin/leads', {'action': 'list', ...params});

  Future<Map<String, dynamic>> leadsSimple() =>
      _post('/api/admin/leads', {'action': 'simple'});

  Future<Map<String, dynamic>> leadAdd(Map<String, dynamic> data) =>
      _post('/api/admin/leads', {'action': 'add', ...data});

  Future<Map<String, dynamic>> leadUpdate(Map<String, dynamic> data) =>
      _post('/api/admin/leads', {'action': 'update', ...data});

  Future<Map<String, dynamic>> leadStatus(int id, String status) =>
      _post('/api/admin/leads', {'action': 'status', 'id': id, 'status': status});

  Future<Map<String, dynamic>> leadConvert(int id) =>
      _post('/api/admin/leads', {'action': 'convert', 'id': id});

  Future<Map<String, dynamic>> leadDelete(int id) =>
      _post('/api/admin/leads', {'action': 'delete', 'id': id});

  Future<Map<String, dynamic>> leadsImport(List<Map<String, dynamic>> rows) =>
      _post('/api/admin/leads', {'action': 'import', 'rows': rows});

  // ── Clients ─────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> clientsList(Map<String, dynamic> params) =>
      _post('/api/admin/clients', {'action': 'list', ...params});

  Future<Map<String, dynamic>> clientsSimple() =>
      _post('/api/admin/clients', {'action': 'simple'});

  Future<Map<String, dynamic>> clientAdd(Map<String, dynamic> data) =>
      _post('/api/admin/clients', {'action': 'add', ...data});

  Future<Map<String, dynamic>> clientUpdate(Map<String, dynamic> data) =>
      _post('/api/admin/clients', {'action': 'update', ...data});

  Future<Map<String, dynamic>> clientStatus(int id, String status) =>
      _post('/api/admin/clients', {'action': 'status', 'id': id, 'status': status});

  Future<Map<String, dynamic>> clientDelete(int id) =>
      _post('/api/admin/clients', {'action': 'delete', 'id': id});

  // ── Proposals ───────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> proposalsList(Map<String, dynamic> params) =>
      _post('/api/admin/proposals', {'action': 'list', ...params});

  Future<Map<String, dynamic>> proposalCreate(Map<String, dynamic> data) =>
      _post('/api/admin/proposals', {'action': 'create', ...data});

  Future<Map<String, dynamic>> proposalUpdate(Map<String, dynamic> data) =>
      _post('/api/admin/proposals', {'action': 'update', ...data});

  Future<Map<String, dynamic>> proposalDelete(int id) =>
      _post('/api/admin/proposals', {'action': 'delete', 'id': id});

  Future<Map<String, dynamic>> proposalDraft(int leadId) =>
      _post('/api/admin/proposals', {'action': 'draft', 'leadId': leadId});

  Future<Map<String, dynamic>> proposalSend(int id) =>
      _post('/api/admin/proposals', {'action': 'send', 'id': id});

  Future<Map<String, dynamic>> proposalStatus(int id, String status) =>
      _post('/api/admin/proposals', {'action': 'status', 'id': id, 'status': status});

  Future<Map<String, dynamic>> proposalShareToken(int id) =>
      _post('/api/admin/proposals', {'action': 'share-token', 'id': id});

  Future<Map<String, dynamic>> proposalPricing(int id) =>
      _post('/api/admin/proposals', {'action': 'pricing', 'id': id});

  // ── Invoices ────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> invoicesList(Map<String, dynamic> params) =>
      _post('/api/admin/invoices', {'action': 'list', ...params});

  Future<Map<String, dynamic>> invoiceCreate(Map<String, dynamic> data) =>
      _post('/api/admin/invoices', {'action': 'create', ...data});

  Future<Map<String, dynamic>> invoiceUpdate(Map<String, dynamic> data) =>
      _post('/api/admin/invoices', {'action': 'update', ...data});

  Future<Map<String, dynamic>> invoiceDelete(int id) =>
      _post('/api/admin/invoices', {'action': 'delete', 'id': id});

  Future<Map<String, dynamic>> invoiceSend(int id) =>
      _post('/api/admin/invoices', {'action': 'send', 'id': id});

  Future<Map<String, dynamic>> invoiceMarkPaid(int id, String paidAt) =>
      _post('/api/admin/invoices', {'action': 'paid', 'id': id, 'paidAt': paidAt});

  Future<Map<String, dynamic>> invoiceConfirmation(int id) =>
      _post('/api/admin/invoices', {'action': 'confirmation', 'id': id});

  Future<Map<String, dynamic>> invoiceOverdue(List<int> ids) =>
      _post('/api/admin/invoices', {'action': 'overdue', 'ids': ids});

  Future<Map<String, dynamic>> invoiceCancel(int id) =>
      _post('/api/admin/invoices', {'action': 'cancel', 'id': id});

  Future<Map<String, dynamic>> invoiceStatus(int id, String status) =>
      _post('/api/admin/invoices', {'action': 'status', 'id': id, 'status': status});

  Future<Map<String, dynamic>> invoiceShareToken(int id) =>
      _post('/api/admin/invoices', {'action': 'share-token', 'id': id});

  // ── Projects ────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> projectsList(Map<String, dynamic> params) =>
      _post('/api/admin/projects', {'action': 'list', ...params});

  Future<Map<String, dynamic>> projectCreate(Map<String, dynamic> data) =>
      _post('/api/admin/projects', {'action': 'create', ...data});

  Future<Map<String, dynamic>> projectUpdate(Map<String, dynamic> data) =>
      _post('/api/admin/projects', {'action': 'update', ...data});

  Future<Map<String, dynamic>> projectDelete(int id) =>
      _post('/api/admin/projects', {'action': 'delete', 'id': id});

  Future<Map<String, dynamic>> projectStatus(int id, String status) =>
      _post('/api/admin/projects', {'action': 'status', 'id': id, 'status': status});

  // ── Reviews ─────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> reviewsList(Map<String, dynamic> params) =>
      _post('/api/admin/reviews', {'action': 'list', ...params});

  Future<Map<String, dynamic>> reviewStatus(int id, String status) =>
      _post('/api/admin/reviews', {'action': 'status', 'id': id, 'status': status});

  Future<Map<String, dynamic>> reviewVerified(int id, bool isVerified) =>
      _post('/api/admin/reviews', {'action': 'verified', 'id': id, 'is_verified': isVerified});

  Future<Map<String, dynamic>> reviewDelete(int id) =>
      _post('/api/admin/reviews', {'action': 'delete', 'id': id});

  // ── Bookings ────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> bookingsList() => _get('/api/admin/bookings');

  Future<Map<String, dynamic>> bookingStatus(String bookingId, String status) =>
      _post('/api/admin/bookings', {'action': 'status', 'bookingId': bookingId, 'status': status});

  Future<Map<String, dynamic>> bookingCreateLead(Map<String, dynamic> data) =>
      _post('/api/admin/bookings', {'action': 'create-lead', ...data});

  // ── Bank accounts ───────────────────────────────────────────────────────
  Future<Map<String, dynamic>> bankAccountsList() =>
      _post('/api/admin/bank-accounts', {'action': 'list'});

  Future<Map<String, dynamic>> bankAccountCreate(Map<String, dynamic> data) =>
      _post('/api/admin/bank-accounts', {'action': 'create', ...data});

  Future<Map<String, dynamic>> bankAccountUpdate(Map<String, dynamic> data) =>
      _post('/api/admin/bank-accounts', {'action': 'update', ...data});

  Future<Map<String, dynamic>> bankAccountDelete(int id) =>
      _post('/api/admin/bank-accounts', {'action': 'delete', 'id': id});

  // ── Email ───────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> emailRecipients() =>
      _post('/api/admin/email', {'action': 'recipients'});

  Future<Map<String, dynamic>> emailSend(Map<String, dynamic> data) =>
      _post('/api/admin/email', {'action': 'send', ...data});

  Future<Map<String, dynamic>> emailSent(int page, int pageSize) =>
      _post('/api/admin/email', {'action': 'sent', 'page': page, 'pageSize': pageSize});

  Future<Map<String, dynamic>> emailDelete(int id) =>
      _post('/api/admin/email', {'action': 'delete', 'id': id});

  // ── Overview ────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> overview() => _get('/api/admin/overview');
}