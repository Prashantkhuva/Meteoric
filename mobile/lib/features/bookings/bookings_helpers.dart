Map<String, dynamic> attendeeOf(Map<String, dynamic> booking) {
  final list = booking['attendees'];
  if (list is List && list.isNotEmpty && list.first is Map) {
    return (list.first as Map).cast<String, dynamic>();
  }
  if (booking['attendee'] is Map) {
    return (booking['attendee'] as Map).cast<String, dynamic>();
  }
  return const <String, dynamic>{};
}

String shortTitle(String? title) {
  if (title == null) return '';
  final idx = title.indexOf(' between ');
  return idx > -1 ? title.substring(0, idx) : title;
}
