const Booking = require('../../models/Booking');

exports.listMine = async (req, res) => {
  try {
    const bookings = await Booking.find({ brokerId: req.vendor._id, status: 'confirmed' })
      .populate('propertyId', 'title city locality price')
      .sort({ createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list broker bookings' });
  }
};

// Manual status hook for cancellation/refund operations.
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['cancelled', 'refund_requested', 'refunded'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Allowed: cancelled, refund_requested, refunded' });
    }

    const booking = await Booking.findOne({ _id: id, brokerId: req.vendor._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    if (status === 'refunded') booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({
      message: 'Booking status updated',
      bookingId: booking._id,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update booking status' });
  }
};
