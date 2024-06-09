# MSSQL Stored Procedures Exporter

This project exports stored procedures from MSSQL databases, creating a separate folder for each database and saving the stored procedures as `.sql` files.

## Requirements

- Node.js (>= 12.0.0)
- MSSQL Server
- NPM packages: `mssql`, `fs`, `path`

## Installation

1. Clone or download this project.
2. Install the required packages by running the following command in the project directory:

```bash
npm install mssql
```

## Usage

1. Edit the `index.js` file and enter your MSSQL connection details:

```javascript
const config = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server',
    options: {
        encrypt: true, // Set to true if you're using SSL, otherwise false
    },
    connectionTimeout: 60000, // 60 seconds connection timeout
    requestTimeout: 600000 // 10 minutes query timeout
};
```

2. Run the script using the following command:

```bash
node index.js
```

## How It Works

The script connects to the MSSQL server, retrieves a list of all databases excluding system databases, and sorts them in descending alphabetical order. For each database, it queries all stored procedures and saves each one as a `.sql` file in a dedicated folder for the database.

## Example Output

The script creates a folder for each database and saves the stored procedures as `.sql` files within these folders.

```
stored_procedures/
├── database1/
│   ├── procedure1.sql
│   ├── procedure2.sql
│   └── ...
├── database2/
│   ├── procedure1.sql
│   ├── procedure2.sql
│   └── ...
└── ...
```

## Troubleshooting

If you encounter any errors, please check the console output and follow these steps:

1. Ensure your MSSQL connection details are correct.
2. Verify that you have the necessary permissions on the MSSQL server.
3. Increase the timeout settings if necessary.

If you encounter any issues or wish to contribute, please open an [issue](https://github.com/your-repo/your-project/issues).

## License

This project is licensed under the MIT License. For more details, see the `LICENSE` file.
