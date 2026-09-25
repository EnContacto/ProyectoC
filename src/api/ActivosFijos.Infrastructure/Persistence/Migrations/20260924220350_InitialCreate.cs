using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ActivosFijos.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AccountingAccounts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountingAccounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ShortCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    DefaultUsefulLifeYears = table.Column<int>(type: "int", nullable: false),
                    DefaultResidualRate = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    ShortName = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Custodians",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Custodians", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DepreciationConfigs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DefaultUsefulLifeYears = table.Column<int>(type: "int", nullable: false),
                    DefaultResidualRate = table.Column<decimal>(type: "decimal(18,6)", precision: 18, scale: 6, nullable: false),
                    EffectiveFrom = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepreciationConfigs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DepreciationSnapshots",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SnapshotDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepreciationSnapshots", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ImportBatches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    FileHash = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    TotalRows = table.Column<int>(type: "int", nullable: false),
                    ProcessedRows = table.Column<int>(type: "int", nullable: false),
                    SuccessRows = table.Column<int>(type: "int", nullable: false),
                    ErrorRows = table.Column<int>(type: "int", nullable: false),
                    ErrorMessage = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RevertedByBatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImportBatches", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ReportRuns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TemplateId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ReportType = table.Column<int>(type: "int", nullable: false),
                    FiltersJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ColumnsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RowCount = table.Column<int>(type: "int", nullable: false),
                    RunAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportRuns", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ReportTemplates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ReportType = table.Column<int>(type: "int", nullable: false),
                    FiltersJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ColumnsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportTemplates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ImportErrors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImportBatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RowNumber = table.Column<int>(type: "int", nullable: false),
                    ColumnName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Severity = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    RawValue = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImportErrors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImportErrors_ImportBatches_ImportBatchId",
                        column: x => x.ImportBatchId,
                        principalTable: "ImportBatches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ImportStaging",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImportBatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RowNumber = table.Column<int>(type: "int", nullable: false),
                    SheetName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    RawJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsValid = table.Column<bool>(type: "bit", nullable: false),
                    IsDuplicate = table.Column<bool>(type: "bit", nullable: false),
                    QualityFlag = table.Column<int>(type: "int", nullable: true),
                    AssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImportStaging", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImportStaging_ImportBatches_ImportBatchId",
                        column: x => x.ImportBatchId,
                        principalTable: "ImportBatches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Assets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CurrentCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Detail = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Brand = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Model = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Serial = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Components = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Capacity = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Dimensions = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Material = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Color = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    InvoiceNumber = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    Provider = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    PurchaseDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AcquisitionYear = table.Column<int>(type: "int", nullable: true),
                    AcquisitionValue = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    PriorResidualValue = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    ResidualRate = table.Column<decimal>(type: "decimal(18,6)", precision: 18, scale: 6, nullable: true),
                    DepreciableAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    PriorUsefulLifeYears = table.Column<int>(type: "int", nullable: true),
                    UsefulLifeYears = table.Column<int>(type: "int", nullable: true),
                    DepreciationRate = table.Column<decimal>(type: "decimal(18,6)", precision: 18, scale: 6, nullable: true),
                    DepreciationStartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FinalDepreciationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TotalDaysToDepreciate = table.Column<int>(type: "int", nullable: true),
                    AccumulatedDepreciation = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    NetCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    LocationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SpecificLocation = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    CustodianId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AccountingAccountId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Classification = table.Column<int>(type: "int", nullable: false),
                    QualityFlag = table.Column<int>(type: "int", nullable: false),
                    ManualReviewRequired = table.Column<bool>(type: "bit", nullable: false),
                    ManualReviewReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MarkedAsReviewed = table.Column<bool>(type: "bit", nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    ImportBatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ExternalRowReference = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Assets_AccountingAccounts_AccountingAccountId",
                        column: x => x.AccountingAccountId,
                        principalTable: "AccountingAccounts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Assets_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Assets_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Assets_Custodians_CustodianId",
                        column: x => x.CustodianId,
                        principalTable: "Custodians",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Assets_ImportBatches_ImportBatchId",
                        column: x => x.ImportBatchId,
                        principalTable: "ImportBatches",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Assets_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AssetEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EventType = table.Column<int>(type: "int", nullable: false),
                    EventDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssetEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AssetEvents_Assets_AssetId",
                        column: x => x.AssetId,
                        principalTable: "Assets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AssetStatusHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PreviousStatus = table.Column<int>(type: "int", nullable: false),
                    NewStatus = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssetStatusHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AssetStatusHistories_Assets_AssetId",
                        column: x => x.AssetId,
                        principalTable: "Assets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DepreciationSchedules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Month = table.Column<int>(type: "int", nullable: false),
                    DepreciationAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    AccumulatedDepreciation = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NetCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    CalculatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DepreciationSnapshotId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepreciationSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DepreciationSchedules_Assets_AssetId",
                        column: x => x.AssetId,
                        principalTable: "Assets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DepreciationSchedules_DepreciationSnapshots_DepreciationSnapshotId",
                        column: x => x.DepreciationSnapshotId,
                        principalTable: "DepreciationSnapshots",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AccountingAccounts_Code",
                table: "AccountingAccounts",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AssetEvents_AssetId",
                table: "AssetEvents",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_AssetEvents_EventDate",
                table: "AssetEvents",
                column: "EventDate");

            migrationBuilder.CreateIndex(
                name: "IX_AssetEvents_EventType",
                table: "AssetEvents",
                column: "EventType");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_AccountingAccountId",
                table: "Assets",
                column: "AccountingAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_CategoryId",
                table: "Assets",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_Classification",
                table: "Assets",
                column: "Classification");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_CompanyId_CategoryId",
                table: "Assets",
                columns: new[] { "CompanyId", "CategoryId" });

            migrationBuilder.CreateIndex(
                name: "IX_Assets_CurrentCode",
                table: "Assets",
                column: "CurrentCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Assets_CustodianId",
                table: "Assets",
                column: "CustodianId");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_ImportBatchId",
                table: "Assets",
                column: "ImportBatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_LocationId",
                table: "Assets",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_PurchaseDate",
                table: "Assets",
                column: "PurchaseDate");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_QualityFlag",
                table: "Assets",
                column: "QualityFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_Status",
                table: "Assets",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_AssetStatusHistories_AssetId",
                table: "AssetStatusHistories",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_AssetStatusHistories_ChangedAt",
                table: "AssetStatusHistories",
                column: "ChangedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ShortCode",
                table: "Categories",
                column: "ShortCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Companies_ShortName",
                table: "Companies",
                column: "ShortName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Custodians_Name",
                table: "Custodians",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_DepreciationConfigs_CompanyId_CategoryId_EffectiveFrom",
                table: "DepreciationConfigs",
                columns: new[] { "CompanyId", "CategoryId", "EffectiveFrom" });

            migrationBuilder.CreateIndex(
                name: "IX_DepreciationSchedules_AssetId",
                table: "DepreciationSchedules",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_DepreciationSchedules_AssetId_Year_Month",
                table: "DepreciationSchedules",
                columns: new[] { "AssetId", "Year", "Month" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DepreciationSchedules_DepreciationSnapshotId",
                table: "DepreciationSchedules",
                column: "DepreciationSnapshotId");

            migrationBuilder.CreateIndex(
                name: "IX_DepreciationSnapshots_SnapshotDate",
                table: "DepreciationSnapshots",
                column: "SnapshotDate");

            migrationBuilder.CreateIndex(
                name: "IX_ImportBatches_FileHash",
                table: "ImportBatches",
                column: "FileHash");

            migrationBuilder.CreateIndex(
                name: "IX_ImportBatches_StartedAt",
                table: "ImportBatches",
                column: "StartedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ImportBatches_Status",
                table: "ImportBatches",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_ImportErrors_ImportBatchId",
                table: "ImportErrors",
                column: "ImportBatchId");

            migrationBuilder.CreateIndex(
                name: "IX_ImportErrors_Severity",
                table: "ImportErrors",
                column: "Severity");

            migrationBuilder.CreateIndex(
                name: "IX_ImportStaging_AssetId",
                table: "ImportStaging",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_ImportStaging_ImportBatchId",
                table: "ImportStaging",
                column: "ImportBatchId");

            migrationBuilder.CreateIndex(
                name: "IX_ImportStaging_IsDuplicate",
                table: "ImportStaging",
                column: "IsDuplicate");

            migrationBuilder.CreateIndex(
                name: "IX_ImportStaging_IsValid",
                table: "ImportStaging",
                column: "IsValid");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_Name",
                table: "Locations",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReportRuns_ReportType",
                table: "ReportRuns",
                column: "ReportType");

            migrationBuilder.CreateIndex(
                name: "IX_ReportRuns_RunAt",
                table: "ReportRuns",
                column: "RunAt");

            migrationBuilder.CreateIndex(
                name: "IX_ReportRuns_TemplateId",
                table: "ReportRuns",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportTemplates_Name",
                table: "ReportTemplates",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_ReportTemplates_ReportType",
                table: "ReportTemplates",
                column: "ReportType");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AssetEvents");

            migrationBuilder.DropTable(
                name: "AssetStatusHistories");

            migrationBuilder.DropTable(
                name: "DepreciationConfigs");

            migrationBuilder.DropTable(
                name: "DepreciationSchedules");

            migrationBuilder.DropTable(
                name: "ImportErrors");

            migrationBuilder.DropTable(
                name: "ImportStaging");

            migrationBuilder.DropTable(
                name: "ReportRuns");

            migrationBuilder.DropTable(
                name: "ReportTemplates");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Assets");

            migrationBuilder.DropTable(
                name: "DepreciationSnapshots");

            migrationBuilder.DropTable(
                name: "AccountingAccounts");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "Custodians");

            migrationBuilder.DropTable(
                name: "ImportBatches");

            migrationBuilder.DropTable(
                name: "Locations");
        }
    }
}
