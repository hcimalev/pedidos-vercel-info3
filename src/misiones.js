
import { ESTADOS } from './datos.js'

// MISIÓN 1 — Calcular el total del pedido
export function totalPedido(pedido) {
  const items = pedido.items || []
  const descuento = pedido.descuento || 0

  const subtotal = items.reduce((suma, item) => {
    return suma + item.cantidad * item.precioUnitario
  }, 0)

  const total = subtotal * (1 - descuento)

  return Math.round((total + Number.EPSILON) * 100) / 100
}

// MISIÓN 2 — Validar transición de estados
export function puedeTransicionar(actual, nuevo) {
  const indiceActual = ESTADOS.indexOf(actual)
  const indiceNuevo = ESTADOS.indexOf(nuevo)

  return indiceActual !== -1 && indiceNuevo === indiceActual + 1
}

// MISIÓN 3 — Validar datos del cliente
export function validarCliente(cliente) {
  const errores = []

  if (!cliente.nombre || cliente.nombre.trim() === '') {
    errores.push('nombre_requerido')
  }

  const telefono = (cliente.telefono || '').replace(/[\s-]/g, '')

  if (!/^\d{10}$/.test(telefono)) {
    errores.push('telefono_invalido')
  }

  const email = (cliente.email || '').trim()

  if (email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errores.push('email_invalido')
  }

  return errores
}

// MISIÓN 4 — Contar pedidos por estado
export function resumenPorEstado(pedidos) {
  const resumen = {}

  for (const estado of ESTADOS) {
    resumen[estado] = 0
  }

  for (const pedido of pedidos) {
    if (Object.prototype.hasOwnProperty.call(resumen, pedido.estado)) {
      resumen[pedido.estado]++
    }
  }

  return resumen
}

// MISIÓN 5 — Buscar pedidos por nombre de cliente
export function buscarPedidos(pedidos, texto) {
  const normalizar = (valor) =>
    String(valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()

  const busqueda = normalizar(texto).trim()

  if (busqueda === '') {
    return pedidos
  }

  return pedidos.filter((pedido) =>
    normalizar(pedido.cliente).includes(busqueda)
  )
}

// MISIÓN 6 — Obtener los mejores clientes
export function topClientes(pedidos, n) {
  const gastos = new Map()

  for (const pedido of pedidos) {
    const cliente = pedido.cliente
    const total = totalPedido(pedido)

    gastos.set(cliente, (gastos.get(cliente) || 0) + total)
  }

  return Array.from(gastos, ([cliente, total]) => ({
    cliente,
    total: Math.round((total + Number.EPSILON) * 100) / 100
  }))
    .sort((a, b) =>
      b.total - a.total ||
      a.cliente.localeCompare(b.cliente, 'es', { sensitivity: 'base' })
    )
    .slice(0, Math.max(0, Math.floor(Number(n) || 0)))
}