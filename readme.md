# Listen1 Backup Migration Script

This script is used to migrate Listen1 V2 backup files to V3 version.

## Prerequisites

Before running this script, make sure you have Node.js installed. You can download and install the latest version of Node.js from the official website (https://nodejs.org).

## Usage

1. Prepare the V2 backup file: Rename your V2 backup file to `listen1_backup.json` and ensure it is located in the same directory as the script file.

2. Download the migration script: Download the `migrants.js` file and place it in the same directory as the V2 backup file.

3. Run the migration script: In the command line, navigate to the directory containing the V2 backup file and `migrants.js`, and execute the following command:
   
   ```
   node migrants.js
   ```

    After running the command, the script will generate a new V3 backup file named `listen1_backup_v3.json`.

4. Import the V3 backup: Import the generated `listen1_backup_v3.json` file into Listen1 V3 version.



## Additional Information

If you encounter any issues or need further assistance during the process, please feel free to make a issue.

# Listen1 备份迁移脚本

该脚本用于将 Listen1 的 V2 版本备份文件迁移到 V3 版本。

## 前提条件

在运行该脚本之前，请确保已安装 Node.js。您可以从官方网站（https://nodejs.org）下载并安装最新版本的 Node.js。

## 使用方法

1. 准备 V2 版本备份文件：将您的 V2 版本备份文件重命名为 `listen1_backup.json`，并确保它位于脚本文件所在的目录中。

2. 下载迁移脚本：下载 `migrants.js` 文件并将其放置在与 V2 版本备份文件相同的目录中。

3. 执行迁移脚本：在命令行中，进入包含 V2 版本备份文件和 `migrants.js` 的目录，并执行以下命令：
   
   ```
   node migrants.js
   ```
   
   执行该命令后，脚本将生成一个名为 `listen1_backup_v3.json` 的 V3 版本备份文件。
4. 导入 V3 版本备份：将生成的 `listen1_backup_v3.json` 文件导入到 Listen1 的 V3 版本中。
   
   
   
   附加信息
   
   如果在使用过程中遇到任何问题或需要进一步的帮助，请随时与我们联系。
