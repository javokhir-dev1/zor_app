/**
 * So'rov validatsiya middleware
 *
 * Kerakli maydonlar mavjudligini tekshiradi.
 *
 * Foydalanish:
 *   router.post('/tasks', validate(['title', 'type', 'reward_points']), controller.create);
 */
function validate(requiredFields) {
  return (req, res, next) => {
    const missing = [];

    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Kerakli maydonlar to\'ldirilmagan.',
        missing_fields: missing,
      });
    }

    next();
  };
}

module.exports = validate;
