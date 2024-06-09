const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// MSSQL veritabanı bağlantı bilgileri
const config = {
    user: 'ava',
    password: 'avatec2020.',
    server: 'soft.avatec.com.tr',
    options: {
        encrypt: false, // Eğer sunucu SSL kullanıyorsa true yapın, aksi halde false
    },
    connectionTimeout: 60000, // 30 saniye bağlantı zaman aşımı
    requestTimeout: 600000 // 5 dakika sorgu zaman aşımı
};


async function getDatabases() {
    try {
        await sql.connect(config);

        const result = await sql.query(`SELECT name FROM sys.databases WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb') ORDER BY name DESC`);
        const databases = result.recordset.map(row => row.name);
        console.log("Databases found (Z->A):", databases);

        return databases;
    } catch (err) {
        console.error("Error fetching databases:", err);
        return [];
    } finally {
        await sql.close();
    }
}

async function exportStoredProcedures(database) {
    const dbConfig = { ...config, database };

    try {
        await sql.connect(dbConfig);

        const result = await sql.query(`
            SELECT 
                SCHEMA_NAME(p.schema_id) AS [Schema], 
                p.name AS [StoredProcedureName], 
                m.definition AS [StoredProcedureDefinition]
            FROM 
                sys.procedures p
            JOIN 
                sys.sql_modules m ON p.object_id = m.object_id
            WHERE 
                p.type = 'P';
        `);

        const procedures = result.recordset.map(row => row.StoredProcedureName);
        console.log(`Stored procedures found for database ${database}:`, procedures);

        if (result.recordset.length === 0) {
            console.log(`No stored procedures found for database ${database}.`);
            return;
        }

        const dir = path.join('./stored_procedures', database);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        for (const row of result.recordset) {
            const schema = row.Schema;
            const spName = row.StoredProcedureName;
            const spDefinition = row.StoredProcedureDefinition;

            const fileName = path.join(dir, `${spName}.sql`);
            const fileContent = `-- Schema: ${schema}\n-- Stored Procedure: ${spName}\n\n${spDefinition}`;

            fs.writeFileSync(fileName, fileContent, { encoding: 'utf8' });
        }

        console.log(`Stored procedures for database ${database} have been saved successfully.`);

    } catch (err) {
        console.error(`Failed to export stored procedures for database ${database}:`, err);
    } finally {
        await sql.close();
    }
}

async function main() {
    const databases = await getDatabases();
    for (const database of databases) {
        console.log(`Processing database: ${database}`);
        await exportStoredProcedures(database);
    }
    console.log("All databases processed.");
}

main();