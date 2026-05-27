var fechaInicial = moment().startOf("year").format("YYYY-MM-DD");
var fechaFinal = moment().endOf("year").format("YYYY-MM-DD");
var fechaActualToExport = moment().format("DD-MM-YYYY");

$("#fechaInicial").val(fechaInicial);
$("#fechaFinal").val(fechaFinal);

$(".content-header h1 i")
  .removeClass("fa-handshake")
  .addClass("fa-file-invoice-dollar");

var $containerCompleto = $("#card_body .row.mb-3");
$containerCompleto
  .removeClass("row mb-3")
  .addClass("d-flex flex-wrap align-items-center justify-content-between gap-2 mt-2 mb-4");

$containerCompleto.html(`
    <div class="d-flex w-100 align-items-center justify-content-between flex-wrap gap-2">
        <div id="contenedor_botones_dt" class="d-flex align-items-center gap-2"></div>
        <div class="d-flex flex-wrap align-items-center gap-3 ms-auto">
            <div class="d-flex align-items-center gap-2">
                <label class="text-sm text-muted mb-0 text-nowrap fw-semibold">Fecha inicial:</label>
                <div class="input-group input-group-sm" style="width:175px;">
                    <input class="form-control" type="date" id="fechaInicial" value="${fechaInicial}"/>
                    <span class="input-group-text btn limpiar_fecha_inicial" title="Limpiar"><i class="fa-regular fa-calendar-xmark"></i></span>
                </div>
            </div>
            <div class="d-flex align-items-center gap-2">
                <label class="text-sm text-muted mb-0 text-nowrap fw-semibold">Fecha final:</label>
                <div class="input-group input-group-sm" style="width:175px;">
                    <input class="form-control" type="date" id="fechaFinal" value="${fechaFinal}"/>
                    <span class="input-group-text btn limpiar_fecha_final" title="Limpiar"><i class="fa-regular fa-calendar-xmark"></i></span>
                </div>
            </div>
            <div class="d-flex align-items-center gap-2">
                <label class="text-sm text-muted mb-0 text-nowrap fw-semibold">Buscar:</label>
                <div class="input-group input-group-sm" style="width:190px;">
                    <span class="input-group-text bg-light"><i class="fa-solid fa-magnifying-glass text-secondary"></i></span>
                    <input class="form-control" type="text" id="buscadorCustom" placeholder="Descripción o estatus…"/>
                    <span class="input-group-text btn limpiar_busqueda" title="Limpiar"><i class="fa-solid fa-xmark"></i></span>
                </div>
            </div>
            <div class="d-flex align-items-center gap-2">
                <label class="text-sm text-muted mb-0 text-nowrap fw-semibold">Empresa:</label>
                <select id="filtroEmpresa" class="form-control form-control-sm" style="width:160px;">
                    <option value="">Todas las empresas</option>
                    <option value="AW Software">AW Software</option>
                    <option value="Al Chile">Al Chile</option>
                    <option value="Dron">Dron</option>
                </select>
            </div>
        </div>
    </div>
`);

var estilosModales = `
<style>
#modal_subir_archivo .modal-content { border-radius: 16px; overflow: hidden; border: none; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
#modal_subir_archivo .modal-header-custom { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%); padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; }
#modal_subir_archivo .modal-header-custom h6 { color: #fff; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: .4px; }
#modal_subir_archivo .modal-header-custom .icon-header { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,.12); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; margin-right: 12px; }
#modal_subir_archivo .modal-body-custom { background: #f8f9fc; padding: 24px; }
#modal_subir_archivo .upload-zone { border: 2px dashed #c4cad8; border-radius: 12px; background: #fff; padding: 28px 20px; text-align: center; transition: border-color .2s, background .2s; cursor: pointer; }
#modal_subir_archivo .upload-zone:hover { border-color: #4a6fa5; background: #f0f4ff; }
#modal_subir_archivo .upload-zone .upload-icon { font-size: 36px; color: #8a99b3; margin-bottom: 10px; }
#modal_subir_archivo .upload-zone label { font-size: 13px; color: #6c757d; display: block; margin-bottom: 12px; }
#modal_subir_archivo .modal-footer-custom { background: #f8f9fc; padding: 14px 24px; border-top: 1px solid #e8ecf4; }
#modal_subir_archivo .btn-subir { background: linear-gradient(135deg, #0f3460, #16213e); color: #fff; border: none; border-radius: 8px; padding: 9px 0; font-weight: 700; font-size: 13px; width: 100%; letter-spacing: .5px; transition: opacity .2s; }
#modal_subir_archivo .btn-subir:hover { opacity: .88; }

/* === Drag & Drop zones === */
.drop-zone { border: 2px dashed #c4cad8; border-radius: 12px; background: #fff; padding: 28px 20px; text-align: center; transition: border-color .25s, background .25s; cursor: pointer; position: relative; }
.drop-zone:hover { border-color: #4a6fa5; background: #f0f4ff; }
.drop-zone.dragover { border-color: #0d6efd; background: #e8f0ff; }
.drop-zone .drop-icon { font-size: 36px; color: #8a99b3; margin-bottom: 10px; }
.drop-zone .drop-label { font-size: 13px; color: #6c757d; display: block; margin-bottom: 8px; }
.drop-zone .drop-hint { font-size: 11px; color: #adb5bd; }
.drop-zone .file-selected { margin-top: 10px; font-size: 12px; color: #198754; font-weight: 600; }
.drop-zone .file-selected i { margin-right: 4px; }

#modal_reactivar_fecha .modal-content { border-radius: 16px; overflow: hidden; border: none; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
#modal_reactivar_fecha .modal-header-custom { background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; }
#modal_reactivar_fecha .modal-header-custom h6 { color: #fff; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: .4px; }
#modal_reactivar_fecha .modal-header-custom .icon-header { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,.18); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; margin-right: 12px; }
#modal_reactivar_fecha .modal-body-custom { background: #f8f9fc; padding: 24px; }
#modal_reactivar_fecha .campo-label { font-size: 11px; font-weight: 700; color: #7a8494; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 6px; }
#modal_reactivar_fecha .form-control { border-radius: 8px; border: 1.5px solid #d0d8e8; font-size: 13px; padding: 8px 12px; transition: border-color .2s, box-shadow .2s; }
#modal_reactivar_fecha .form-control:focus { border-color: #0d6efd; box-shadow: 0 0 0 3px rgba(13,110,253,.12); }
#modal_reactivar_fecha .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 50px; cursor: pointer; font-size: 12px; font-weight: 600; border: 2px solid transparent; transition: all .15s; }
#modal_reactivar_fecha .status-pill.pendiente { background:#fff8e1; color:#856404; border-color:#ffc107; }
#modal_reactivar_fecha .status-pill.pendiente.active { background:#ffc107; color:#fff; }
#modal_reactivar_fecha .status-pill.autorizado { background:#e8f5e9; color:#2e7d32; border-color:#4caf50; }
#modal_reactivar_fecha .status-pill.autorizado.active { background:#4caf50; color:#fff; }
#modal_reactivar_fecha .modal-footer-custom { background: #f8f9fc; padding: 14px 24px; border-top: 1px solid #e8ecf4; }
#modal_reactivar_fecha .btn-renovar { background: linear-gradient(135deg, #0d6efd, #0a58ca); color: #fff; border: none; border-radius: 8px; padding: 9px 0; font-weight: 700; font-size: 13px; width: 100%; letter-spacing: .5px; transition: opacity .2s; }
#modal_reactivar_fecha .btn-renovar:hover { opacity: .88; }

.btn-outline-warning { color: #7869f8 !important; border-color: #7869f8 !important; }
.btn-outline-warning:hover { background-color: #ffbf00 !important; color: #000 !important; }
.btn-xs { padding: 0.2rem 0.4rem !important; font-size: 0.75rem !important; }
.btn-xs i { margin: 0 !important; }

/* === Fix select2 dentro del modal === */
#modal .select2-container { width: 100% !important; }
#modal .select2-container--default .select2-selection--single {
    height: calc(1.5em + .75rem + 2px);
    border: 1px solid #ced4da;
    border-radius: .25rem;
    display: flex;
    align-items: center;
    padding: 0 .75rem;
}
#modal .select2-container--default .select2-selection--single .select2-selection__rendered {
    line-height: 1.5;
    padding: 0;
    color: #495057;
    width: 100%;
}
#modal .select2-container--default .select2-selection--single .select2-selection__arrow {
    height: 100%;
    top: 0;
    right: 8px;
}
#modal .select2-container--default .select2-selection--single .select2-selection__placeholder {
    color: #6c757d;
}
</style>`;
$("head").append(estilosModales);

$("#modal_subir_archivo .modal-content").html(`
    <div class="modal-header-custom">
        <div class="d-flex align-items-center">
            <div class="icon-header"><i class="fa-solid fa-file-arrow-up"></i></div>
            <h6>Adjuntar Evidencia</h6>
        </div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body-custom">
        <input type="hidden" id="archivo_id">
        <div class="drop-zone" id="upload_drop_zone">
            <div class="drop-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>
            <span class="drop-label">Arrastra tu PDF aquí o haz clic para seleccionar</span>
            <span class="drop-hint">Solo archivos PDF</span>
            <input type="file" id="input_file_upload" accept="application/pdf" style="display:none;">
            <div class="file-selected" id="upload_file_name" style="display:none;"><i class="fa-solid fa-file-pdf"></i> <span></span></div>
        </div>
    </div>
    <div class="modal-footer-custom">
        <button type="button" id="btn_guardar_archivo" class="btn-subir">
            <i class="fa-solid fa-upload me-2"></i>SUBIR ARCHIVO
        </button>
    </div>
`);

$("#modal_reactivar_fecha .modal-content").html(`
    <div class="modal-header-custom">
        <div class="d-flex align-items-center">
            <div class="icon-header"><i class="fa-solid fa-arrow-rotate-left"></i></div>
            <h6>Cotización</h6>
        </div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body-custom">
        <input type="hidden" id="reactivar_id">
        <div class="mb-4">
            <div class="campo-label">Nueva fecha del registro</div>
            <input type="date" id="reactivar_fecha" class="form-control" required>
        </div>
        <div class="mb-4">
            <div class="campo-label">Nuevo monto</div>
            <div class="input-group input-group-sm">
                <span class="input-group-text fw-bold">$</span>
                <input type="number" id="reactivar_monto" class="form-control" min="0" step=".01" placeholder="00.00">
            </div>
            <small class="text-muted" style="font-size:11px;">Déjalo vacío para conservar el monto actual.</small>
        </div>
        <div>
            <div class="campo-label mb-2">Nuevo estatus</div>
            <div class="d-flex gap-2 flex-wrap">
                <div class="status-pill pendiente active" data-val="Pendiente" id="pill_pendiente">
                    <i class="fa-solid fa-clock"></i> Pendiente
                </div>
                <div class="status-pill autorizado" data-val="Autorizado" id="pill_autorizado">
                    <i class="fa-solid fa-circle-check"></i> Autorizado
                </div>
            </div>
            <input type="hidden" id="reactivar_status" value="Pendiente">
        </div>
    </div>
    <div class="modal-footer-custom">
        <button type="button" id="btn_guardar_reactivacion" class="btn-renovar">
            <i class="fa-solid fa-rotate me-2"></i>RENOVAR AHORA
        </button>
    </div>
`);

$(document).on("click", ".status-pill", function () {
  $(".status-pill").removeClass("active");
  $(this).addClass("active");
  $("#reactivar_status").val($(this).data("val"));
});

// ========== DRAG & DROP: modal_subir_archivo ==========
var archivoDropEvidencia = null;

function initDropZone(zoneSelector, fileInputSelector, fileNameSelector, setFileCb) {
  $(document).on("click", zoneSelector, function (e) {
    if (e.target.tagName !== "INPUT") $(fileInputSelector).trigger("click");
  });
  $(document).on("change", fileInputSelector, function () {
    var file = this.files[0] || null;
    if (file && file.type !== "application/pdf") {
      Swal.fire("Atención", "Solo se permiten archivos PDF.", "warning");
      $(this).val("");
      return;
    }
    setFileCb(file);
    if (file) {
      $(fileNameSelector).find("span").text(file.name);
      $(fileNameSelector).show();
    } else {
      $(fileNameSelector).hide();
    }
  });
  $(document).on("dragover", zoneSelector, function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).addClass("dragover");
  });
  $(document).on("dragleave", zoneSelector, function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).removeClass("dragover");
  });
  $(document).on("drop", zoneSelector, function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).removeClass("dragover");
    var files = e.originalEvent.dataTransfer.files;
    if (files.length === 0) return;
    var file = files[0];
    if (file.type !== "application/pdf") {
      Swal.fire("Atención", "Solo se permiten archivos PDF.", "warning");
      return;
    }
    setFileCb(file);
    $(fileNameSelector).find("span").text(file.name);
    $(fileNameSelector).show();
  });
}

initDropZone("#upload_drop_zone", "#input_file_upload", "#upload_file_name", function (f) {
  archivoDropEvidencia = f;
});

// ========== DRAG & DROP: modal agregar/editar ==========
var archivoDropModal = null;

initDropZone("#modal_drop_zone", "#input_archivo_hidden", "#modal_file_name", function (f) {
  archivoDropModal = f;
});

var tabla_registros_cotizacion = $("#tabla_registros_cotizacion").DataTable({
  responsive: true,
  searching: true,
  paging: true,
  order: [[4, "desc"]],
  language: { url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/es-mx.json" },
  ajax: {
    url: "../Models/RegistroCotizacion/Cotizaciones.php",
    type: "POST",
    data: function (d) {
      d.accion = "mostrar";
      d.fechaInicial = $("#fechaInicial").val();
      d.fechaFinal = $("#fechaFinal").val();
      d.empresa = $("#filtroEmpresa").val();
    },
    dataSrc: function (json) {
      if (json.Resultado === "incorrecto") return [];
      return json.Datos || [];
    },
    error: function (xhr, error, thrown) {
      console.error("DataTables Ajax error:", xhr.status, xhr.responseText);
      mostrarBlockOutListo();
    },
  },
  dom: '<"clear">Brt<"row mt-3"<"col-md-6"i><"col-md-6 text-end"p>>',
  buttons: [
    { extend: "pdfHtml5", footer: true, text: '<i class="fas fa-file-pdf"></i>', className: "btn btn-danger btn-sm px-3", title: "Reporte Cotizaciones " + fechaActualToExport, exportOptions: { columns: [0, 1, 2, 3, 4, 5] } },
    { extend: "excelHtml5", footer: true, text: '<i class="fas fa-file-excel"></i>', className: "btn btn-success btn-sm px-3", title: "Reporte Cotizaciones " + fechaActualToExport, exportOptions: { columns: [0, 1, 2, 3, 4, 5] } },
  ],
  initComplete: function () {
    var botones = $(".dt-buttons").detach();
    $("#contenedor_botones_dt").append(botones);
    $(".dt-buttons").removeClass("btn-group");
  },
  columns: [
    { data: "empresa" },
    { data: "cliente" },
    { data: "descripcion" },
    { data: "monto", render: function (data) { return "$ " + parseFloat(data).toLocaleString("es-MX", { minimumFractionDigits: 2 }); } },
    { data: "fecha", render: function (data, type) { if (type === "sort" || type === "type") return data; return moment(data).format("DD-MM-YYYY"); } },
    {
      data: "status",
      render: function (data) {
        if (data == "Pendiente") return `<span class="badge bg-warning text-dark px-2 py-1"><i class="fa-solid fa-clock"></i> Pendiente</span>`;
        if (data == "Autorizado") return `<span class="badge bg-success px-2 py-1"><i class="fa-solid fa-circle-check"></i> Autorizado</span>`;
        if (data == "Cancelado") return `<span class="badge bg-danger px-2 py-1"><i class="fa-solid fa-ban"></i> Cancelado</span>`;
        return data;
      },
    },
    {
      data: null,
      render: function (data, type, row) {
        let btnEditar = `<button class="btn btn-outline-primary btn-xs btn_editar_cotizacion" data-id="${row.id}" title="Editar"><i class="fa-solid fa-pen"></i></button>`;
        let btnAccion = "";
        if (row.status == "Pendiente") {
          btnAccion = `<button class="btn btn-outline-success btn-xs btn_cambiar_status_directo" data-id="${row.id}" data-status="Autorizado" title="Autorizar"><i class="fa-solid fa-check"></i></button>
                       <button class="btn btn-outline-danger btn-xs btn_cambiar_status_directo" data-id="${row.id}" data-status="Cancelado" title="Cancelar"><i class="fa-solid fa-xmark"></i></button>`;
        } else if (row.status == "Autorizado") {
          btnAccion = `<span class="text-success"><i class="fa-solid fa-circle-check"></i></span>`;
        } else if (row.status == "Cancelado") {
          btnAccion = `<button class="btn btn-outline-warning btn-xs btn_reactivar_cotizacion" data-id="${row.id}" data-fecha="${row.fecha}" data-monto="${row.monto}" title="Renovar"><i class="fa-solid fa-rotate-left"></i></button>`;
        }
        return `<div class="d-flex gap-1 justify-content-center">${btnEditar}${btnAccion}</div>`;
      },
    },
    {
      data: null,
      render: function (data, type, row) {
        if (row.evidencia) {
          return `
            <div class="d-flex gap-1 justify-content-center">
              <a href="../${row.evidencia.replace("../", "")}" target="_blank" class="btn btn-outline-dark btn-sm" title="Ver Evidencia">
                <i class="fa-solid fa-file-lines"></i>
              </a>
              <button class="btn btn-outline-primary btn-sm btn_subir_evidencia" data-id="${row.id}" title="Subir otro archivo">
                <i class="fa-solid fa-upload"></i>
              </button>
            </div>`;
        }
        return `<button class="btn btn-outline-secondary btn-sm btn_subir_evidencia" data-id="${row.id}" title="Subir archivo">
                  <i class="fa-solid fa-upload"></i>
                </button>`;
      },
    },
  ],
  createdRow: function (row, data) {
    $(row).removeClass("table-success table-warning table-danger");
    if (data.status == "Pendiente") $(row).addClass("table-warning");
    if (data.status == "Autorizado") $(row).addClass("table-success");
    if (data.status == "Cancelado") $(row).addClass("table-danger");
  },
  footerCallback: function (row, data, start, end, display) {
    var api = this.api();
    var intVal = function (i) {
      return typeof i === "string" ? i.replace(/[\$,]/g, "") * 1 : typeof i === "number" ? i : 0;
    };
    var total = api.rows({ page: "current" }).data().reduce(function (a, b) { return intVal(a) + intVal(b.monto); }, 0);
    $(api.column(3).footer()).html("$ " + total.toLocaleString("es-MX", { minimumFractionDigits: 2 }));
  },
});

// FILTROS
$(document).on("keyup", "#buscadorCustom", function () {
  tabla_registros_cotizacion.search(this.value).draw();
});
$(document).on("click", ".limpiar_busqueda", function () {
  $("#buscadorCustom").val("");
  tabla_registros_cotizacion.search("").draw();
});
$(document).on("change", "#fechaInicial, #fechaFinal, #filtroEmpresa", function () {
  mostrarBlockOutCargando();
  tabla_registros_cotizacion.ajax.reload(function () { mostrarBlockOutListo(); }, false);
});
$(document).on("click", ".limpiar_fecha_inicial", function () {
  $("#fechaInicial").val("");
  mostrarBlockOutCargando();
  tabla_registros_cotizacion.ajax.reload(function () { mostrarBlockOutListo(); }, false);
});
$(document).on("click", ".limpiar_fecha_final", function () {
  $("#fechaFinal").val("");
  mostrarBlockOutCargando();
  tabla_registros_cotizacion.ajax.reload(function () { mostrarBlockOutListo(); }, false);
});

// EDITAR COTIZACIÓN
$(document).on("click", ".btn_editar_cotizacion", function () {
  let id = $(this).attr("data-id");
  $.ajax({
    url: "../Models/RegistroCotizacion/Cotizaciones.php",
    type: "POST",
    dataType: "json",                 
    data: { accion: "obtener", id: id },
    success: function (res) {          
      if (res.Resultado === "correcto") {
        let d = res.Datos;
        $("#accion").val("editar");
        $("#id").val(d.Id || d.id);
        $("#input_empresa").val(d.Empresa);
        $("#input_cliente").val(d.Cliente_id).trigger("change");
        $("#input_descripcion").val(d.Descripcion);
        $("#input_monto").val(d.Monto);
        $("#input_fecha").val(d.Fecha);
        $("#input_status").val(d.Status);
        $("#input_archivo_hidden").val("");
        archivoDropModal = null;
        $("#modal_file_name").hide();
        $("#modalLabel").html('<i class="fa-solid fa-pen"></i>&nbsp; EDITAR COTIZACIÓN');
        $("#btn_enviar_formulario").text("GUARDAR CAMBIOS");
        let modal = new bootstrap.Modal(document.getElementById("modal"));
        modal.show();
      }
    },
  });
});

// CAMBIAR ESTATUS
$(document).on("click", ".btn_cambiar_status_directo", function () {
  let id = $(this).attr("data-id");
  let status = $(this).attr("data-status");
  Swal.fire({
    title: "¿Confirmar acción?",
    text: status === "Autorizado" ? "¿Autorizar cotización?" : "¿Cancelar cotización?",
    icon: "warning", showCancelButton: true,
    confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
    confirmButtonText: "Sí", cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "../Models/RegistroCotizacion/Cotizaciones.php",
        type: "POST",
        data: { accion: "editar_status", id: id, status: status },
        success: function () {
          mostrarBlockOutCargando();
          tabla_registros_cotizacion.ajax.reload(function () { mostrarBlockOutListo(); }, false);
        },
      });
    }
  });
});

// MODAL SUBIR EVIDENCIA (registro ya existente)
$(document).on("click", ".btn_subir_evidencia", function (e) {
  e.preventDefault();
  $("#archivo_id").val($(this).attr("data-id"));
  $("#input_file_upload").val("");
  archivoDropEvidencia = null;
  $("#upload_file_name").hide();
  var modalArchivo = new bootstrap.Modal(document.getElementById("modal_subir_archivo"));
  modalArchivo.show();
});

// GUARDAR ARCHIVO (registro ya existente)
$(document).on("click", "#btn_guardar_archivo", function () {
  let fileInput = document.getElementById("input_file_upload");
  var archivo = archivoDropEvidencia || (fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null);
  if (!archivo) {
    Swal.fire("Atención", "Selecciona o arrastra un archivo PDF.", "warning");
    return;
  }
  if (archivo.type !== "application/pdf") {
    Swal.fire("Atención", "Solo se permiten archivos PDF.", "warning");
    return;
  }
  let id = $("#archivo_id").val();
  let formData = new FormData();
  formData.append("accion", "subir_archivo");
  formData.append("id", id);
  formData.append("adjunto", archivo);

  mostrarBlockOutCargando();
  $.ajax({
    url: "../Models/RegistroCotizacion/Cotizaciones.php",
    type: "POST", data: formData, processData: false, contentType: false,
    success: function () {
      archivoDropEvidencia = null;
      var modalEl = document.getElementById("modal_subir_archivo");
      var modalInstancia = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstancia.hide();
      tabla_registros_cotizacion.ajax.reload(function () { mostrarBlockOutListo(); }, false);
    },
    error: function () {
      mostrarBlockOutListo();
      Swal.fire("Error", "No se pudo subir el archivo.", "error");
    },
  });
});

$(document).on("click", ".btn_reactivar_cotizacion", function (e) {
  e.preventDefault();
  $("#reactivar_id").val($(this).attr("data-id"));
  $("#reactivar_fecha").val($(this).attr("data-fecha"));
  $("#reactivar_monto").val($(this).attr("data-monto") || "");
  $(".status-pill").removeClass("active");
  $("#pill_pendiente").addClass("active");
  $("#reactivar_status").val("Pendiente");
  var modalRenovar = new bootstrap.Modal(document.getElementById("modal_reactivar_fecha"));
  modalRenovar.show();
});

$(document).on("click", "#btn_guardar_reactivacion", function () {
  let id = $("#reactivar_id").val();
  let nueva_fecha = $("#reactivar_fecha").val();
  let nuevo_status = $("#reactivar_status").val() || "Pendiente";
  let nuevo_monto = $("#reactivar_monto").val();
  if (nueva_fecha === "") return;
  Swal.fire({
    title: "¿Renovar registro?",
    text: "¿Deseas aplicar los cambios y renovar las fechas?",
    icon: "question", showCancelButton: true,
    confirmButtonColor: "#28a745", cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí", cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "../Models/RegistroCotizacion/Cotizaciones.php",
        type: "POST",
        data: { accion: "reactivar_y_fecha", id: id, fecha: nueva_fecha, status: nuevo_status, monto: nuevo_monto },
        success: function () {
          var modalEl = document.getElementById("modal_reactivar_fecha");
          var modalInstancia = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
          modalInstancia.hide();
          mostrarBlockOutCargando();
          tabla_registros_cotizacion.ajax.reload(function () { mostrarBlockOutListo(); }, false);
        },
      });
    }
  });
});

// ABRIR MODAL AGREGAR
$("#btn_abrir_modal").on("click", function () {
  $("#formulario_modal")[0].reset();
  $("#accion").val("agregar");
  $("#id").val("");
  $("#input_status").val("Pendiente");
  $("#input_fecha").val(moment().format("YYYY-MM-DD"));
  $("#input_archivo_hidden").val("");
  archivoDropModal = null;
  $("#modal_file_name").hide();
  $("#input_cliente").val(null).trigger("change");
  $("#modalLabel").html('<i class="fa-solid fa-file-invoice-dollar"></i>&nbsp; AGREGAR COTIZACIÓN');
  $("#btn_enviar_formulario").text("AGREGAR");
});

// ENVIAR FORMULARIO 
$("#btn_enviar_formulario").off("click").on("click", function (e) {
  e.preventDefault();

  let errores = [];
  if (!$("#input_empresa").val()) errores.push("Selecciona una <strong>Empresa</strong>.");
  if (!$("#input_cliente").val() || $("#input_cliente").val() === "" || $("#input_cliente").val() === "-1")
    errores.push("Selecciona un <strong>Cliente</strong>.");
  if (!$("#input_descripcion").val().trim()) errores.push("Ingresa una <strong>Descripción</strong>.");
  if (!$("#input_monto").val() || parseFloat($("#input_monto").val()) <= 0) errores.push("Ingresa un <strong>Monto</strong> válido.");
  if (!$("#input_fecha").val()) errores.push("Selecciona una <strong>Fecha</strong>.");

  if (errores.length > 0) {
    Swal.fire({
      icon: "warning",
      title: "Campos requeridos",
      html: "<ul class='text-start mt-2'>" + errores.map((e) => `<li>${e}</li>`).join("") + "</ul>",
      confirmButtonText: "Entendido", confirmButtonColor: "#3085d6",
    });
    return;
  }

  let archivoHidden = document.getElementById("input_archivo_hidden");
  var archivoFinal = archivoDropModal || (archivoHidden && archivoHidden.files.length > 0 ? archivoHidden.files[0] : null);
  let accionActual = $("#accion").val();

  let formData = new FormData();
  formData.append("accion",      accionActual);
  formData.append("id",          $("#id").val());
  formData.append("empresa",     $("#input_empresa").val());
  formData.append("cliente",     $("#input_cliente").val());
  formData.append("descripcion", $("#input_descripcion").val());
  formData.append("monto",       $("#input_monto").val());
  formData.append("fecha",       $("#input_fecha").val());
  formData.append("status",      $("#input_status").val());

  if (archivoFinal) {
    formData.append("adjunto", archivoFinal);
  }

  mostrarBlockOutCargando();

  $.ajax({
    url: "../Models/RegistroCotizacion/Cotizaciones.php",
    type: "POST", data: formData, processData: false, contentType: false,
    success: function () { cerrarModalYRecargar(); },
    error: function () {
      mostrarBlockOutListo();
      Swal.fire("Error", "Ocurrió un error al guardar", "error");
    },
  });
});

function cerrarModalYRecargar() {
  archivoDropModal = null;
  let modalElement = document.getElementById("modal");
  let modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) modalInstance.hide();
  document.activeElement.blur();
  $("body").removeClass("modal-open");
  $(".modal-backdrop").remove();
  $("body").css("padding-right", "");
  tabla_registros_cotizacion.ajax.reload(function () {
    tabla_registros_cotizacion.columns.adjust().responsive.recalc();
    setTimeout(function () {
      mostrarBlockOutListo();
      Swal.close();
    }, 300);
  }, false);
}

// RESETEAR FORMULARIO
$("#btn_reset_formulario").on("click", function () {
  $("#formulario_modal")[0].reset();
  $("#input_status").val("Pendiente");
  $("#input_fecha").val(moment().format("YYYY-MM-DD"));
  $("#input_cliente").val(null).trigger("change");
  $("#input_archivo_hidden").val("");
  archivoDropModal = null;
  $("#modal_file_name").hide();
});

$("#modal").on("shown.bs.modal", function () {
  if (!$("#input_cliente").hasClass("select2-hidden-accessible")) {
    $("#input_cliente").select2({
      placeholder: "Buscar cliente...",
      allowClear: false,
      width: "100%",
      dropdownParent: $("#modal"),
    });
  }
});

// LIMPIAR MODAL al cerrarlo
document.addEventListener("hidden.bs.modal", function () {
  if (document.activeElement) document.activeElement.blur();
  $("body").removeClass("modal-open");
  $(".modal-backdrop").remove();
  $("body").css("padding-right", "");
});
