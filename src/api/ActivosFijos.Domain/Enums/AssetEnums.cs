namespace ActivosFijos.Domain.Enums;

public enum AssetClassification
{
    Activo = 1,
    Inventario = 2
}

public enum AssetQualityFlag
{
    Verde = 1,
    Amarillo = 2,
    Rojo = 3,
    Naranja = 4,
    Azul = 5
}

public enum AssetStatus
{
    Bueno = 1,
    Regular = 2,
    Malo = 3,
    DarDeBaja = 4,
    Faltante = 5,
    CambioDeSerie = 6,
    Vendido = 7,
    Nd = 99
}

public enum AssetEventType
{
    Baja = 1,
    Venta = 2,
    Faltante = 3,
    Revaluacion = 4,
    Ajuste = 5,
    Reclasificacion = 6
}

public enum ImportBatchStatus
{
    Pendiente = 1,
    Procesando = 2,
    Completado = 3,
    CompletadoConErrores = 4,
    Fallido = 5,
    Revertido = 6
}

public enum ImportErrorSeverity
{
    Info = 1,
    Advertencia = 2,
    Error = 3,
    Critico = 4
}

public enum ReportType
{
    Activos = 1,
    Depreciacion = 2,
    Conciliacion = 3,
    Inventario = 4,
    Proyeccion = 5,
    BajasYFaltantes = 6,
    MenoresA500 = 7
}