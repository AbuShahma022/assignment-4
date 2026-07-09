const formatAvailability = (availability: any) => ({
  ...availability,
  startTime: availability.startTime.toISOString().substring(11, 16),
  endTime: availability.endTime.toISOString().substring(11, 16),
});

const formatBookingAvailability = (booking: any) => ({
  ...booking,
  availability: formatAvailability(booking.availability),
});

export { formatAvailability, formatBookingAvailability };