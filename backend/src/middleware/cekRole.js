const cekRole = (...roleDiizinkan) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Kamu harus login terlebih dahulu.'
      });
    }

    if (!roleDiizinkan.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Halaman ini hanya untuk ${roleDiizinkan.join(' atau ')}.`
      });
    }

    next();
  };
};

module.exports = cekRole;
