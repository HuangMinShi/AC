const add = (a, b) => {
  const err = 'something wrong!!'
  const maxNumber = Number.MAX_SAFE_INTEGER

  if (a <= 0 || b <= 0) return err
  if (typeof a !== 'number' || typeof b !== 'number') return err
  if (a >= maxNumber || b >= maxNumber) return err

  return a + b
}

