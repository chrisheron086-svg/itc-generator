// Client profiles
// template_folder must match a folder name in backend/templates/
// equipment list defines which equipment types are available for this client

const CLIENTS = [
  {
    id: "tailem_bend_3",
    name: "Tailem Bend 3 BESS",
    template_folder: "Tailem_Bend_3",
    cpp_project_name: "Tailem Bend 3",
    cpp_job_no: "13279",
    client_project_title: "Tailem Bend 3 BESS",
    client_project_number: "13279",
    site_location: "261 Lime Kiln Road, Tailem Bend SA",
    prepared_by_name: "Chris Heron",
    prepared_by_position: "Senior Commissioning Officer",
    checked_by_name: "Frank Maloney",
    checked_by_position: "Commissioning Manager",
    checked_by_signature: "F Maloney",
    client_checked_by_name: "Andrew Pezzuto",
    client_checked_by_position: "Senior Electrical Engineer",
    // Equipment available for this client
    primary_equipment: [
      { value: "circuit_breaker", label: "Circuit Breaker" },
      { value: "current_transformer", label: "Current Transformer" },
      { value: "voltage_transformer", label: "Voltage Transformer" },
      { value: "power_transformer", label: "Power Transformer" },
      { value: "isolator", label: "Isolator" },
      { value: "surge_arrestor", label: "Surge Arrestor" },
      { value: "neutral_ct", label: "Neutral CT" },
      { value: "earth_switch", label: "Earth Switch" },
      { value: "ows", label: "OWS" },
      { value: "net", label: "NET" },
      { value: "aux_tf", label: "Auxiliary Transformer" },
      { value: "bess_pcs", label: "BESS PCS" },
      { value: "ac_board", label: "AC Board" },
      { value: "dc_panel", label: "DC Panel" },
      { value: "feeder_panel", label: "Feeder Panel" },
    ],
    secondary_equipment: [
      { value: "sel_751_feeder_relay", label: "SEL 751 Feeder Relay" },
    ],
  },
];

export default CLIENTS;
