

const indicadoresIniciales = [

  {
    id: 1,
    codigo: "OEI.0X",
    nombre: "Mejorar la calidad psicologica",
    tipo: "OEI",
    hijos: [
      {
        id: 2,
        codigo: "AEI.01",
        nombre: "Capacitación docente",
        tipo: "AEI",
        hijos: [
          {
            id: 3,
            codigo: "IP.01",
            nombre: "N° de docentes capacitados",
            tipo: "IP",
            hijos: [
              {
                id: 4,
                codigo: "AEI.01",
                nombre: "Capacitación docente",
                tipo: "AEI",
                hijos: [
                  {
                    id: 5,
                    codigo: "IP.01",
                    nombre: "N° de docentes capacitados",
                    tipo: "IP",
                    hijos: []
                  },
                  {
                    id: 6,
                    codigo: "IP.02",
                    nombre: "Horas de capacitación",
                    tipo: "IP",
                    hijos: []
                  },
                  {
                    id: 7,
                    codigo: "IP.01",
                    nombre: "N° de docentes capacitados",
                    tipo: "IP",
                    hijos: []
                  },
                  {
                    id: 8,
                    codigo: "IP.02",
                    nombre: "Horas de capacitación",
                    tipo: "IP",
                    hijos: []
                  }
                ]
              },
            ]
          },
          {
            id: 9,
            codigo: "IP.02",
            nombre: "Horas de capacitación",
            tipo: "IP",
            hijos: []
          },
          {
            id: 10,
            codigo: "IP.01",
            nombre: "N° de docentes capacitados",
            tipo: "IP",
            hijos: []
          },
          {
            id: 11,
            codigo: "IP.02",
            nombre: "Horas de capacitación",
            tipo: "IP",
            hijos: []
          }
        ]
      },
      {
        id: 12,
        codigo: "AEI.02",
        nombre: "Mejorar infraestructura",
        tipo: "AEI",
        hijos: [
          {
            id: 13,
            codigo: "IP.03",
            nombre: "Aulas renovadas",
            tipo: "IP",
            hijos: []
          }
        ]
      }
    ]
  },
  {
    id: 14,
    codigo: "OEI.0X",
    nombre: "Mejorar la calidad psicologica",
    tipo: "OEI",
    hijos: [
      {
        id: 15,
        codigo: "AEI.01",
        nombre: "Capacitación docente",
        tipo: "AEI",
        hijos: [
          {
            id: 16,
            codigo: "IP.01",
            nombre: "N° de docentes capacitados",
            tipo: "IP",
            hijos: []
          },
          {
            id: 17,
            codigo: "IP.02",
            nombre: "Horas de capacitación",
            tipo: "IP",
            hijos: []
          },
          {
            id: 18,
            codigo: "IP.01",
            nombre: "N° de docentes capacitados",
            tipo: "IP",
            hijos: []
          },
          {
            id: 19,
            codigo: "IP.02",
            nombre: "Horas de capacitación",
            tipo: "IP",
            hijos: []
          }
        ]
      },
      {
        id: 20,
        codigo: "AEI.02",
        nombre: "Mejorar infraestructura",
        tipo: "AEI",
        hijos: [
          {
            id: 6,
            codigo: "IP.03",
            nombre: "Aulas renovadas",
            tipo: "IP",
            hijos: []
          }
        ]
      }
    ]
  }
];

export default indicadoresIniciales;