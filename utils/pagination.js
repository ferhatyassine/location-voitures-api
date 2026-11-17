const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const parsePositiveInteger = (value, defaultValue) => {
  if (value === undefined) return defaultValue;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
};

export const getPagination = (req, res) => {
  const page = parsePositiveInteger(req.query.page, DEFAULT_PAGE);
  const limit = parsePositiveInteger(req.query.limit, DEFAULT_LIMIT);
  const offset = page === null || limit === null ? null : (page - 1) * limit;

  if (
    page === null ||
    limit === null ||
    limit > MAX_LIMIT ||
    !Number.isSafeInteger(offset)
  ) {
    res.status(400).json({
      message: `Les paramètres page et limit doivent être des entiers positifs (limit maximum : ${MAX_LIMIT})`,
    });
    return null;
  }

  return { page, limit, offset };
};

export const paginationMetadata = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
