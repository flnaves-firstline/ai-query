export const randomNumber = (min = 0, max = Number.MAX_VALUE) => Math.floor(Math.random() * (max - min + 1)) + min;

export const randomDate = (min = new Date(0), max = new Date()) =>
  new Date(min.getTime() + Math.random() * (max.getTime() - min.getTime()));
