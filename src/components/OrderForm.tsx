'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'

type Product = {
  id: string
  name: string
  price: number
}

type Props = {
  clientId: string
  onCreated?: () => void
}

export default function OrderForm({ clientId, onCreated }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [productId, setProductId] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price')
      .order('name', { ascending: true })

    if (!error && data) {
      setProducts(
        data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price || 0),
        }))
      )
      if (data.length > 0 && !productId) {
        setProductId(data[0].id)
      }
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientId) {
      setError('Aucun client sélectionné.')
      return
    }
    if (!productId) {
      setError('Choisissez un produit.')
      return
    }
    if (quantity <= 0) {
      setError('La quantité doit être supérieure à 0.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const product = products.find((p) => p.id === productId)
      const unitPrice = product?.price || 0
      const total = unitPrice * quantity

      // create order
      const { data: orderInsert, error: orderError } = await supabase
        .from('orders')
        .insert({
          client_id: clientId,
          status: 'draft',
          total_amount: total,
        })
        .select('id')
        .single()

      if (orderError || !orderInsert) {
        console.error(orderError)
        setError('Erreur lors de la création de la commande.')
        setLoading(false)
        return
      }

      const orderId = orderInsert.id

      // create order_item
      const { error: itemError } = await supabase.from('order_items').insert({
        order_id: orderId,
        product_id: productId,
        quantity,
        unit_price: unitPrice,
      })

      if (itemError) {
        console.error(itemError)
        setError('Erreur lors de l\'enregistrement des lignes de commande.')
        setLoading(false)
        return
      }

      setSuccess('Pré-commande enregistrée.')
      setQuantity(1)
      if (onCreated) onCreated()
    } catch (err) {
      console.error(err)
      setError('Erreur inattendue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Produit
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border rounded"
          >
            {products.length === 0 && <option value="">Aucun produit</option>}
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.price.toFixed(2)} DA)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Quantité
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-2 py-1.5 text-sm border rounded"
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-600">{success}</p>}
      <button
        type="submit"
        disabled={loading || products.length === 0}
        className="w-full px-3 py-2 text-sm rounded bg-orange-600 text-white disabled:opacity-60"
      >
        {loading ? 'Enregistrement…' : 'Enregistrer une pré-commande'}
      </button>
    </form>
  )
}

export function ClientRecentOrders({ clientId }: { clientId: string }) {
  const [orders, setOrders] = useState<any[]>([])
  const supabase = createClient()

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('id, total_amount, created_at, status')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(5)

    setOrders(data || [])
  }

  useEffect(() => {
    if (clientId) fetchOrders()
  }, [clientId])

  if (!clientId) return null

  return (
    <div className="mt-4">
      <h3 className="font-semibold text-sm mb-2">Dernières pré-commandes</h3>
      {orders.length === 0 ? (
        <p className="text-xs text-gray-500">Aucune pré-commande pour ce client.</p>
      ) : (
        <ul className="space-y-1 text-xs">
          {orders.map((o) => (
            <li
              key={o.id}
              className="flex items-center justify-between px-2 py-1 border rounded"
            >
              <span>
                {new Date(o.created_at).toLocaleDateString()} – {o.status}
              </span>
              <span className="font-semibold">{Number(o.total_amount || 0).toFixed(2)} DA</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
