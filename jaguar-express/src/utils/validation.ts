// Validación de email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validación de teléfono colombiano
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+57)?\s?[3][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Verificar si un negocio está abierto
export function isBusinessOpen(
  horarioApertura: string,
  horarioCierre: string,
  currentTime?: Date
): boolean {
  const now = currentTime || new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const [openHour, openMinute] = horarioApertura.split(':').map(Number);
  const [closeHour, closeMinute] = horarioCierre.split(':').map(Number);

  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;

  // Manejar horarios que cruzan medianoche
  if (closeTimeInMinutes < openTimeInMinutes) {
    return (
      currentTimeInMinutes >= openTimeInMinutes ||
      currentTimeInMinutes <= closeTimeInMinutes
    );
  }

  return (
    currentTimeInMinutes >= openTimeInMinutes &&
    currentTimeInMinutes <= closeTimeInMinutes
  );
}
