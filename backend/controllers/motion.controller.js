const db = require('../config/db');

/*
====================================================
1. SYSTEM SETTINGS (ON / OFF MONITORING)
====================================================
*/

// Ambil status sistem (dipakai Admin & User)
exports.getSystemStatus = (req, res) => {
    const query = `
        SELECT setting_value 
        FROM system_settings 
        WHERE setting_name = 'monitoring_status'
        LIMIT 1
    `;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length === 0) {
            return res.status(404).json({
                message: 'System setting not found'
            });
        }

        res.json({
            active: result[0].setting_value === 1
        });
    });
};

// Update status ON/OFF (Admin switch)
exports.updateSystemStatus = (req, res) => {
    const { active } = req.body;

    if (typeof active !== 'boolean') {
        return res.status(400).json({
            message: 'Invalid payload'
        });
    }

    const val = active ? 1 : 0;

    const query = `
        UPDATE system_settings
        SET setting_value = ?, updated_at = NOW()
        WHERE setting_name = 'monitoring_status'
    `;

    db.query(query, [val], (err) => {
        if (err) return res.status(500).json(err);

        res.json({
            message: 'System status updated successfully',
            active
        });
    });
};

/*
====================================================
2. MOTION LOGS
====================================================
*/

// Tambah data motion (ESP32 → Backend → DB)
exports.addMotion = (req, res) => {
    const { device_id, motion } = req.body;

    // Validasi payload dari ESP32
    if (!device_id || typeof motion !== 'boolean') {
        return res.status(400).json({
            message: 'Invalid payload'
        });
    }

    // Cek status sistem terlebih dahulu
    const checkQuery = `
        SELECT setting_value
        FROM system_settings
        WHERE setting_name = 'monitoring_status'
        LIMIT 1
    `;

    db.query(checkQuery, (err, result) => {
        if (err) return res.status(500).json(err);

        // Jika sistem OFF → TOLAK DATA
        if (result.length === 0 || result[0].setting_value === 0) {
            return res.status(403).json({
                message: 'Monitoring system is OFF'
            });
        }

        // Jika ON → SIMPAN KE DATABASE
        const insertQuery = `
            INSERT INTO motion_logs (device_id, motion)
            VALUES (?, ?)
        `;

        db.query(insertQuery, [device_id, motion], (err) => {
            if (err) return res.status(500).json(err);

            res.json({
                message: 'Motion log saved successfully'
            });
        });
    });
};

// Ambil data motion terakhir + status sistem
exports.getLatestMotion = (req, res) => {
    const query = `
        SELECT 
            m.*,
            s.setting_value AS system_active
        FROM system_settings s
        LEFT JOIN motion_logs m ON 1=1
        WHERE s.setting_name = 'monitoring_status'
        ORDER BY m.created_at DESC
        LIMIT 1
    `;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);

        const data = result[0] || {};

        res.json({
            ...data,
            system_active: data.system_active === 1
        });
    });
};

// Ambil semua riwayat motion
exports.getAllMotion = (req, res) => {
    const query = `
        SELECT *
        FROM motion_logs
        ORDER BY created_at DESC
    `;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

// Statistik motion per jam (grafik harian)
exports.getHourlyStats = (req, res) => {
    const query = `
        SELECT 
            HOUR(created_at) AS hour,
            COUNT(*) AS total
        FROM motion_logs
        WHERE DATE(created_at) = CURDATE()
          AND motion = true
        GROUP BY HOUR(created_at)
        ORDER BY hour ASC
    `;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};
