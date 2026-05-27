<?php
    require_once "../Templates/header.php";
    require_once "../Templates/nav_bar.php";
    require_once "../Templates/side_bar.php";

    include '../Models/DB_connection.php';

    $db = new DB_connection();

    $clientes_fiscales = $db->SelectAll("
    SELECT id, nom_cliente
    FROM datos_fiscales
    WHERE estatus = 1
    ORDER BY nom_cliente ASC
    ");

    $pagina_acutal = "Registrar cotización";
?>
<div class="content-wrapper text-sm">
   <section class="content-header">
      <div class="container-fluid">
         <div class="row mb-2">
            <div class="col-sm-6">
               <h1>
                  <i class="fa-solid fa-handshake"></i>&nbsp; <?php echo $pagina_acutal ?>
                  <em class="fw-ligth lead text-sm" id="em_titulo">|&nbsp; Listado de registros de cotizaciones</em>
               </h1>
            </div>
            <div class="col-sm-6">
               <ol class="breadcrumb float-sm-right">
                  <li class="breadcrumb-item"><a href="<?php echo $ADMIN_PATH ?>"><i class="fa-solid fa-house"></i>&nbsp; Admin</a></li>
                  <li class="breadcrumb-item">Módulo Cotizaciones</li>
                  <li class="breadcrumb-item active"><?php echo $pagina_acutal ?></li>
               </ol>
            </div>
         </div>
      </div>
   </section>

   <section class="content">
      <div class="card card-outline card-dark shadow">
         <div class="container-fluid mt-2">
            <button class="float-end btn btn-success fw-bold" id="btn_abrir_modal" type="button" data-bs-toggle="modal" data-bs-target="#modal"><i class="fa-solid fa-circle-plus"></i>&nbsp; AGREGAR COTIZACIÓN</button>
         </div>
         <div class="card-body" id="card_body">
            <div class="row mb-3">
               <div class="col-md-3"><input type="date" id="fechaInicial" class="form-control"></div>
               <div class="col-md-3"><input type="date" id="fechaFinal" class="form-control"></div>
               <div class="col-md-3">
                  <select id="filtroEmpresa" class="form-control">
                     <option value="">Todas</option>
                     <option value="AW Software">AW Software</option>
                     <option value="Al Chile">Al Chile</option>
                     <option value="Dron">Dron</option>
                  </select>
               </div>
            </div>
            <table id="tabla_registros_cotizacion" class="table table-hover text-center" style="width:100%">
               <thead class="thead-dark">
                  <tr>
                     <th>Empresa</th>
                     <th>Cliente</th>
                     <th>Descripción</th>
                     <th class="sum-monto">Monto</th>
                     <th>Fecha</th>
                     <th>Estatus</th>
                     <th class="renovar">Acciones</th>
                     <th>Cotización</th>
                  </tr>
               </thead>
               <tbody></tbody>
               <tfoot>
                  <tr class="thead-dark">
                     <th>Totales</th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                  </tr>
               </tfoot>
            </table>
         </div>
      </div>
   </section>

   <div class="modal fade" id="modal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
         <div class="modal-content">
            <div class="modal-header">
               <h5 class="modal-title fw-bold" id="modalLabel"><i class="fa-solid fa-file-invoice-dollar"></i>&nbsp; AGREGAR COTIZACIÓN</h5>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <form id="formulario_modal" enctype="multipart/form-data">
                  <input type="hidden" id="accion" name="accion" value="agregar">
                  <input type="hidden" id="id" name="id" value="">
                  <div class="mb-3 row">
                     <label class="col-sm-2 col-form-label fw-bold">Empresa:</label>
                     <div class="col-sm-10">
                        <select class="form-control" id="input_empresa" name="empresa">
                           <option value="">Selecciona una Empresa</option>
                           <option value="AW Software">AW Software</option>
                           <option value="Al Chile">Al Chile</option>
                           <option value="Dron">Dron</option>
                        </select>
                     </div>
                  </div>
                  <div class="mb-3 row">
                     <label class="col-sm-2 col-form-label fw-bold">Cliente:</label>
                     <div class="col-sm-10">
                        <select class="select2 form-control" style="width:100%" id="input_cliente" name="cliente">
                           <option value=""></option>
                           <?php
                           foreach ($clientes_fiscales as $cliente) {
                              echo "<option value='{$cliente['id']}'>{$cliente['nom_cliente']}</option>";
                           }
                           ?>
                        </select>
                     </div>
                  </div>
                  <div class="mb-3 row">
                     <label class="col-sm-2 col-form-label fw-bold">Descripción:</label>
                     <div class="col-sm-10"><textarea class="form-control" id="input_descripcion" name="descripcion"></textarea></div>
                  </div>
                  <div class="mb-3 row">
                     <label class="col-sm-2 col-form-label fw-bold">Monto:</label>
                     <div class="col-sm-10 input-group">
                        <span class="input-group-text fw-bold">$</span>
                        <input type="number" class="form-control" id="input_monto" name="monto" min="0" step=".01" placeholder="00.00">
                     </div>
                  </div>
                  <div class="mb-3 row">
                     <label class="col-sm-2 col-form-label fw-bold">Fecha:</label>
                     <div class="col-sm-10"><input type="date" class="form-control" id="input_fecha" name="fecha"></div>
                  </div>
                  <div class="mb-3 row">
                     <label class="col-sm-2 col-form-label fw-bold">Estatus:</label>
                     <div class="col-sm-10">
                        <select class="form-control" id="input_status" name="status">
                           <option value="Pendiente">Pendiente</option>
                           <option value="Autorizado">Autorizado</option>
                           <option value="Cancelado">Cancelado</option>
                        </select>
                     </div>
                  </div>
                  <div class="mb-3 row">
                     <label class="col-sm-2 col-form-label fw-bold">Evidencia:</label>
                     <div class="col-sm-10">
                        <input type="file" class="form-control" id="input_archivo" name="adjunto" accept="application/pdf">
                        <small class="text-muted">Opcional. Adjunta el PDF de evidencia.</small>
                     </div>
                  </div>
               </form>
            </div>
            <div class="modal-footer">
               <button type="button" id="btn_enviar_formulario" class="btn btn-success fw-bold">AGREGAR</button>
               <button type="button" id="btn_reset_formulario" class="btn btn-secondary">Limpiar todo</button>
            </div>
         </div>
      </div>
   </div>

   <div class="modal fade" id="modal_reactivar_fecha" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
         <div class="modal-content shadow-lg border-0">
            <div class="modal-header bg-gradient-primary text-white py-2">
               <h6 class="modal-title fw-bold"><i class="fa-solid fa-arrow-rotate-left"></i> Renovación Express</h6>
               <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body bg-light">
               <input type="hidden" id="reactivar_id">
               <div class="form-group mb-3">
                  <label class="text-xs text-secondary fw-bold">Nueva Fecha del Registro:</label>
                  <input type="date" id="reactivar_fecha" class="form-control border-primary shadow-sm" required>
               </div>
               <div class="form-group">
                  <label class="text-xs text-secondary fw-bold">Nuevo Estatus:</label>
                  <select id="reactivar_status" class="form-control border-primary shadow-sm">
                     <option value="Pendiente">Pendiente (Recomendado)</option>
                     <option value="Autorizado">Autorizado</option>
                  </select>
               </div>
            </div>
            <div class="modal-footer bg-light py-2">
               <button type="button" id="btn_guardar_reactivacion" class="btn btn-primary btn-sm w-100 fw-bold shadow">RENOVAR AHORA</button>
            </div>
         </div>
      </div>
   </div>

   <div class="modal fade" id="modal_subir_archivo" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
         <div class="modal-content shadow-lg border-0">
            <div class="modal-header bg-gradient-dark text-white py-2">
               <h6 class="modal-title fw-bold"><i class="fa-solid fa-file-arrow-up"></i> Adjuntar Documentación</h6>
               <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body bg-light">
               <input type="hidden" id="archivo_id">
               <div class="form-group text-center">
                  <label class="text-xs text-secondary fw-bold mb-2 d-block text-start">Seleccione el documento de evidencia:</label>
                  <div class="drop-zone-area" id="upload_drop_zone">
                     <div class="drop-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>
                     <div class="drop-text">Arrastra y suelta tu archivo PDF aquí</div>
                     <div class="drop-text-small">o haz clic para seleccionar</div>
                     <input type="file" id="input_file_upload" accept="application/pdf">
                     <div class="file-selected" id="file_selected_name" style="display:none;"></div>
                  </div>
               </div>
            </div>
            <div class="modal-footer bg-light py-2">
               <button type="button" id="btn_guardar_archivo" class="btn btn-success btn-sm w-100 fw-bold shadow">SUBIR Y PROCESAR</button>
            </div>
         </div>
      </div>
   </div>

</div>
<?php require_once '../Templates/footer.php'; ?>

<script src="../Scripts/index.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"></script>

<script src="//cdn.datatables.net/plug-ins/1.10.12/sorting/datetime-moment.js"></script>

<script src="../Scripts/registrar_cotizaciones.js"></script>
