<?php
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

if (file_exists("../Models/DB_connection.php")) {
    require_once "../Models/DB_connection.php";
} elseif (file_exists("./Models/DB_connection.php")) {
    require_once "./Models/DB_connection.php";
} elseif (file_exists("../../Models/DB_connection.php")) {
    require_once "../../Models/DB_connection.php";
}

class Cotizacion extends DB_connection
{
    public function mostrarCotizaciones()
    {
        try {
            $empresa      = trim($_POST['empresa'] ?? '');
            $fechaInicial = trim($_POST['fechaInicial'] ?? '');
            $fechaFinal   = trim($_POST['fechaFinal'] ?? '');

            $where  = "WHERE rc.registro_cotizacion_activo = 1";
            $params = [];

            if ($empresa !== '') {
                $where    .= " AND rc.registro_cotizacion_empresa = ?";
                $params[]  = $empresa;
            }
            if ($fechaInicial !== '' && $fechaFinal !== '') {
                $where    .= " AND rc.registro_cotizacion_fecha BETWEEN ? AND ?";
                $params[]  = $fechaInicial;
                $params[]  = $fechaFinal;
            }

            $query = "SELECT
                rc.registro_cotizacion_id          AS id,
                rc.registro_cotizacion_empresa     AS empresa,
                rc.registro_cotizacion_cliente_id  AS cliente_id,
                rc.registro_cotizacion_descripcion AS descripcion,
                rc.registro_cotizacion_monto       AS monto,
                rc.registro_cotizacion_fecha       AS fecha,
                rc.registro_cotizacion_status      AS status,
                rc.registro_cotizacion_evidencia   AS evidencia,
                df.nom_cliente                     AS cliente,
                df.correo                          AS email
                FROM registros_cotizacion AS rc
                INNER JOIN datos_fiscales AS df
                  ON df.id = rc.registro_cotizacion_cliente_id
                $where
                ORDER BY rc.registro_cotizacion_fecha ASC";

            if (method_exists($this, 'SelectAllParams')) {
                $resultado = $this->SelectAllParams($query, $params);
            } else {
                $resultado = $this->SelectAll($this->bindParams($query, $params));
            }

            if ($resultado && is_array($resultado) && sizeof($resultado) > 0) {
                foreach ($resultado as &$r) {
                    $r['monto'] = isset($r['monto']) ? (float) $r['monto'] : 0;
                }
                $respuesta = ["Resultado" => "correcto", "Datos" => $resultado];
            } else {
                $respuesta = ["Resultado" => "incorrecto", "Datos" => []];
            }
        } catch (Exception $e) {
            $respuesta = ["Resultado" => "error", "Datos" => [], "Mensaje" => $e->getMessage()];
        }
        die(json_encode($respuesta));
    }

    private function bindParams($query, $params)
    {
        foreach ($params as $p) {
            $p     = addslashes($p);
            $query = preg_replace('/\?/', "'$p'", $query, 1);
        }
        return $query;
    }

    public function mostrarCotizacion($id)
    {
        try {
            $id    = intval($id);
            $query = "SELECT
                rc.registro_cotizacion_id,
                rc.registro_cotizacion_empresa,
                rc.registro_cotizacion_cliente_id,
                rc.registro_cotizacion_descripcion,
                rc.registro_cotizacion_monto,
                rc.registro_cotizacion_fecha,
                rc.registro_cotizacion_status,
                df.nom_cliente,
                df.correo
                FROM registros_cotizacion AS rc
                INNER JOIN datos_fiscales AS df
                  ON df.id = rc.registro_cotizacion_cliente_id
                WHERE rc.registro_cotizacion_id = $id";

            $consulta = $this->SelectOnlyOne($query);

            if ($consulta) {
                $respuesta = [
                    "Resultado" => "correcto",
                    "Datos"     => [
                        "Id"          => $consulta["registro_cotizacion_id"],
                        "Empresa"     => $consulta["registro_cotizacion_empresa"],
                        "Cliente_id"  => $consulta["registro_cotizacion_cliente_id"],
                        "Descripcion" => $consulta["registro_cotizacion_descripcion"],
                        "Monto"       => $consulta["registro_cotizacion_monto"],
                        "Fecha"       => $consulta["registro_cotizacion_fecha"],
                        "Status"      => $consulta["registro_cotizacion_status"],
                    ],
                ];
            } else {
                $respuesta = ["Resultado" => "incorrecto"];
            }
        } catch (Exception $e) {
            $respuesta = ["Resultado" => "error", "Mensaje" => $e->getMessage()];
        }
        die(json_encode($respuesta));
    }

    public function agregarCotizacion($empresa, $cliente_id, $descripcion, $monto, $fecha, $status, $rutaEvidencia = null)
    {
        try {
            $query = "INSERT INTO registros_cotizacion
                (registro_cotizacion_empresa, registro_cotizacion_cliente_id,
                 registro_cotizacion_descripcion, registro_cotizacion_monto,
                 registro_cotizacion_fecha, registro_cotizacion_status,
                 registro_cotizacion_evidencia)
                VALUES (?,?,?,?,?,?,?)";
            $this->ExecuteQuery($query, [$empresa, $cliente_id, $descripcion, $monto, $fecha, $status, $rutaEvidencia]);
            $respuesta = ["Resultado" => 'correcto', "Mensaje_alerta" => 'Cotización agregada correctamente.'];
        } catch (Exception $e) {
            $respuesta = ["Resultado" => 'error', "Mensaje_alerta" => $e->getMessage()];
        }
        die(json_encode($respuesta));
    }

    public function eliminarCotizacion($id)
    {
        try {
            $query = "UPDATE registros_cotizacion
                SET registro_cotizacion_activo    = 0,
                    registro_cotizacion_eliminado = current_timestamp
                WHERE registro_cotizacion_id      = ?";
            $this->ExecuteQuery($query, [$id]);
            $respuesta = ["Resultado" => 'correcto', "Mensaje_alerta" => 'Cotización eliminada correctamente.'];
        } catch (Exception $e) {
            $respuesta = ["Resultado" => 'error', "Mensaje_alerta" => $e->getMessage()];
        }
        die(json_encode($respuesta));
    }
}

function obtenerNombreCliente($cotizacion_id)
{
    $db = new Cotizacion();
    $query = "SELECT df.nom_cliente, df.id AS cliente_id
              FROM registros_cotizacion AS rc
              INNER JOIN datos_fiscales AS df ON df.id = rc.registro_cotizacion_cliente_id
              WHERE rc.registro_cotizacion_id = " . intval($cotizacion_id);
    $resultado = $db->SelectOnlyOne($query);
    if ($resultado) {
        return [
            'nombre'     => $resultado['nom_cliente'],
            'cliente_id' => $resultado['cliente_id']
        ];
    }
    return null;
}

function sanitizarNombreArchivo($texto)
{
    $texto = mb_strtolower(trim($texto), 'UTF-8');
    $texto = preg_replace('/[áàäâ]/u', 'a', $texto);
    $texto = preg_replace('/[éèëê]/u', 'e', $texto);
    $texto = preg_replace('/[íìïî]/u', 'i', $texto);
    $texto = preg_replace('/[óòöô]/u', 'o', $texto);
    $texto = preg_replace('/[úùüû]/u', 'u', $texto);
    $texto = preg_replace('/ñ/u', 'n', $texto);
    $texto = preg_replace('/[^a-z0-9]+/', '_', $texto);
    $texto = trim($texto, '_');
    return $texto;
}

function guardarArchivoEvidencia($input_name, $id, $nom_cliente = null, $cliente_id = null)
{
    if (! isset($_FILES[$input_name]) || $_FILES[$input_name]['error'] !== 0) {
        return null;
    }

    $folder = __DIR__ . "/../../Uploads/Cotizaciones/";

    if (! file_exists($folder)) {
        @mkdir($folder, 0777, true);
    }

    $ext = strtolower(pathinfo($_FILES[$input_name]['name'], PATHINFO_EXTENSION));
    if ($ext !== 'pdf') {
        return null;
    }

    if ($nom_cliente === null || $cliente_id === null) {
        $infoCliente = obtenerNombreCliente($id);
        if ($infoCliente) {
            $nom_cliente = $infoCliente['nombre'];
            $cliente_id  = $infoCliente['cliente_id'];
        } else {
            $nom_cliente = 'sin_cliente';
            $cliente_id  = 0;
        }
    }

    $fechaHoy       = date('Y-m-d');
    $nombreSanitizado = sanitizarNombreArchivo($nom_cliente);
    $nombreBase     = $nombreSanitizado . "_" . intval($cliente_id) . "_" . $fechaHoy;

    $nombre  = $nombreBase . "." . $ext;
    $destino = $folder . $nombre;

    $contador = 1;
    while (file_exists($destino)) {
        $nombre  = $nombreBase . "_" . $contador . "." . $ext;
        $destino = $folder . $nombre;
        $contador++;
    }

    if (move_uploaded_file($_FILES[$input_name]['tmp_name'], $destino)) {
        return "../Uploads/Cotizaciones/" . $nombre;
    }
    return null;
}

//  DISPATCHER
$Cotizacion = new Cotizacion();

if (isset($_POST['accion'])) {
    $accion = $_POST['accion'];

    if ($accion == "mostrar") {
        $Cotizacion->mostrarCotizaciones();
    }

    if ($accion == "agregar") {
        $empresa     = $_POST['empresa'] ?? '';
        $cliente_id  = $_POST['cliente'] ?? '';
        $descripcion = $_POST['descripcion'] ?? '';
        $monto       = $_POST['monto'] ?? '0';
        $fecha       = $_POST['fecha'] ?? '';
        $status      = $_POST['status'] ?? 'Pendiente';
        $monto       = is_numeric($monto) ? floatval($monto) : 0;

        try {
            $queryInsert = "INSERT INTO registros_cotizacion
            (registro_cotizacion_empresa, registro_cotizacion_cliente_id,
             registro_cotizacion_descripcion, registro_cotizacion_monto,
             registro_cotizacion_fecha, registro_cotizacion_status)
            VALUES (?,?,?,?,?,?)";

            $Cotizacion->ExecuteQueryWhitLastId($queryInsert, [$empresa, $cliente_id, $descripcion, $monto, $fecha, $status]);
            $id = $Cotizacion->GetLastId();

            if (isset($_FILES['adjunto']) && $_FILES['adjunto']['error'] === 0 && $id) {
                $infoCliente = $Cotizacion->SelectOnlyOne(
                    "SELECT nom_cliente FROM datos_fiscales WHERE id = " . intval($cliente_id)
                );
                $nom_cliente = $infoCliente ? $infoCliente['nom_cliente'] : null;
                $ruta = guardarArchivoEvidencia('adjunto', $id, $nom_cliente, $cliente_id);
                if ($ruta) {
                    $Cotizacion->ExecuteQuery(
                        "UPDATE registros_cotizacion SET registro_cotizacion_evidencia = ? WHERE registro_cotizacion_id = ?",
                        [$ruta, $id]
                    );
                }
            }

            echo json_encode(["Resultado" => "correcto", "id" => $id]);
        } catch (Exception $e) {
            echo json_encode(["Resultado" => "error", "Mensaje" => $e->getMessage()]);
        }
        die();
    }

    if ($accion == "obtener") {
        $id = $_POST['id'] ?? '';
        $Cotizacion->mostrarCotizacion($id);
    }

    if ($accion == "editar") {
        $id          = $_POST['id'] ?? '';
        $empresa     = $_POST['empresa'] ?? '';
        $cliente_id  = $_POST['cliente'] ?? '';
        $descripcion = $_POST['descripcion'] ?? '';
        $monto       = $_POST['monto'] ?? '0';
        $fecha       = $_POST['fecha'] ?? '';
        $status      = $_POST['status'] ?? '';
        $monto       = is_numeric($monto) ? floatval($monto) : 0;

        try {
            $rutaNueva = null;
            if (isset($_FILES['adjunto']) && $_FILES['adjunto']['error'] === 0) {
                $rutaNueva = guardarArchivoEvidencia('adjunto', $id);
            }

            if ($rutaNueva) {
                $query = "UPDATE registros_cotizacion SET
                registro_cotizacion_empresa     = ?,
                registro_cotizacion_cliente_id  = ?,
                registro_cotizacion_descripcion = ?,
                registro_cotizacion_monto       = ?,
                registro_cotizacion_fecha       = ?,
                registro_cotizacion_status      = ?,
                registro_cotizacion_evidencia   = ?
                WHERE registro_cotizacion_id    = ?";
                $Cotizacion->ExecuteQuery($query, [$empresa, $cliente_id, $descripcion, $monto, $fecha, $status, $rutaNueva, $id]);
            } else {
                $query = "UPDATE registros_cotizacion SET
                registro_cotizacion_empresa     = ?,
                registro_cotizacion_cliente_id  = ?,
                registro_cotizacion_descripcion = ?,
                registro_cotizacion_monto       = ?,
                registro_cotizacion_fecha       = ?,
                registro_cotizacion_status      = ?
                WHERE registro_cotizacion_id    = ?";
                $Cotizacion->ExecuteQuery($query, [$empresa, $cliente_id, $descripcion, $monto, $fecha, $status, $id]);
            }

            echo json_encode(["Resultado" => "correcto"]);
        } catch (Exception $e) {
            echo json_encode(["Resultado" => "error", "Mensaje" => $e->getMessage()]);
        }
        die();
    }

    if ($accion == "editar_status") {
        $id     = $_POST['id'] ?? '';
        $status = $_POST['status'] ?? '';
        $Cotizacion->ExecuteQuery(
            "UPDATE registros_cotizacion SET registro_cotizacion_status = ? WHERE registro_cotizacion_id = ?",
            [$status, $id]
        );
        echo json_encode(["Resultado" => "correcto"]);
        die();
    }

    if ($accion == "reactivar_y_fecha") {
        $id     = $_POST['id'] ?? '';
        $fecha  = $_POST['fecha'] ?? '';
        $status = $_POST['status'] ?? 'Pendiente';
        $monto  = $_POST['monto'] ?? '';

        if ($monto !== '' && is_numeric($monto)) {
            $Cotizacion->ExecuteQuery(
                "UPDATE registros_cotizacion
                    SET registro_cotizacion_fecha     = ?,
                        registro_cotizacion_status    = ?,
                        registro_cotizacion_monto     = ?,
                        registro_cotizacion_evidencia = NULL
                    WHERE registro_cotizacion_id      = ?",
                [$fecha, $status, floatval($monto), $id]
            );
        } else {
            $Cotizacion->ExecuteQuery(
                "UPDATE registros_cotizacion
                    SET registro_cotizacion_fecha     = ?,
                        registro_cotizacion_status    = ?,
                        registro_cotizacion_evidencia = NULL
                    WHERE registro_cotizacion_id      = ?",
                [$fecha, $status, $id]
            );
        }
        echo json_encode(["Resultado" => "correcto"]);
        die();
    }

    if ($accion == "subir_archivo") {
        $id = $_POST['id'] ?? '';
        try {
            $ruta = guardarArchivoEvidencia('adjunto', $id);
            if ($ruta) {
                $Cotizacion->ExecuteQuery(
                    "UPDATE registros_cotizacion SET registro_cotizacion_evidencia = ? WHERE registro_cotizacion_id = ?",
                    [$ruta, $id]
                );
                echo json_encode(["Resultado" => "correcto", "ruta" => $ruta]);
            } else {
                echo json_encode(["Resultado" => "error", "Mensaje" => "No se pudo guardar el archivo"]);
            }
        } catch (Exception $e) {
            echo json_encode(["Resultado" => "error", "Mensaje" => $e->getMessage()]);
        }
        die();
    }

    if ($accion == "eliminar") {
        $id = $_POST['id'] ?? '';
        $Cotizacion->eliminarCotizacion($id);
    }
}
