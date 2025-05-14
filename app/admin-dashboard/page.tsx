'use client'

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import '../../src/app/globals.css'

type User = {
  id: number
  email: string
}

type Price = {
  price: string
  price_date: string
}

type Product = {
  product_id: number
  product_name: string
  description: string
  image: string
  category_name: string
  price_history: Price[]
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userEditEmail, setUserEditEmail] = useState("")

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productEditForm, setProductEditForm] = useState({ product_name: "", description: "" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
        if (!token) return

        const [usersRes, productsRes] = await Promise.all([
          fetch("http://localhost:8089/api/admin/users/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8089/api/admin/products/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (!usersRes.ok || !productsRes.ok) {
          throw new Error("Failed to fetch users or products")
        }

        setUsers(await usersRes.json())
        setProducts(await productsRes.json())
      } catch (error) {
        console.error("Error fetching admin data:", error)
      }
    }

    fetchData()
  }, [])

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

  const handleDeleteUser = async (userId: number) => {
    if (!token) return
    try {
      const res = await fetch(`http://localhost:8089/api/admin/users/${userId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId))
      } else {
        console.error("Failed to delete user")
      }
    } catch (err) {
      console.error("Error deleting user:", err)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!token) return
    try {
      const res = await fetch(`http://localhost:8089/api/admin/products/${productId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.product_id !== productId))
      } else {
        console.error("Failed to delete product")
      }
    } catch (err) {
      console.error("Error deleting product:", err)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setUserEditEmail(user.email)
  }

  const handleUpdateUser = async (updatedUser: User) => {
    if (!updatedUser || !token) return;
try {
  const res = await fetch(`http://localhost:8089/api/admin/users/${updatedUser.id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email: updatedUser.email }),
  });

  if (res.ok) {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setEditingUser(null);
  } else {
    console.error("Failed to update user");
  }
} catch (err) {
  console.error("Error updating user:", err);
}
    }
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductEditForm({
      product_name: product.product_name,
      description: product.description,
    })
  }

 const handleUpdateProduct = async (updatedProduct: Product) => {
  try {
    const response = await fetch(`http://localhost:8089/api/admin/products/${updatedProduct.product_id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProduct),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      throw new Error("Failed to update product");
    }

    const data = await response.json();
    console.log("Product updated:", data);

    // Update product in local state
    setProducts(prev =>
      prev.map(p =>
        p.product_id === updatedProduct.product_id ? updatedProduct : p
      )
    );

    // Close edit form
    setEditingProduct(null);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Error:", error);
    }
  }
};



  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center">Admin Dashboard</h1>

      {/* Users Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">All Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <CardContent>
                {editingUser?.id === user.id ? (
                  <div className="space-y-2">
                    <input
                      className="w-full p-1 border rounded bg-white"
                      value={userEditEmail}
                      onChange={(e) => setUserEditEmail(e.target.value)}
                    />
                    <div className="space-x-2">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                            if (editingUser) {
                            const updatedUser = {
                                ...editingUser,
                                email: userEditEmail,
                            };
                            handleUpdateUser(updatedUser);
                            }
                        }}
                        >
                        Save
                        </button>

                      <button className="bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setEditingUser(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-gray-800">ID: {user.id}</p>
                    <p className="text-gray-600">Email: {user.email}</p>
                    <div className="mt-2 space-x-2">
                      <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                      <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => handleEditUser(user)}>Edit</button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Products by Category</h2>
        <div className="space-y-6">
          {products.map((product) => (
            <Card key={product.product_id} className="p-4">
              <CardContent className="space-y-2">
                {editingProduct?.product_id === product.product_id ? (
                  <div className="space-y-2">
                    <input
                      className="w-full p-1 border rounded bg-white"
                      value={productEditForm.product_name}
                      onChange={(e) => setProductEditForm({ ...productEditForm, product_name: e.target.value })}
                    />
                    <textarea
                      className="w-full p-1 border rounded bg-white"
                      value={productEditForm.description}
                      onChange={(e) => setProductEditForm({ ...productEditForm, description: e.target.value })}
                    />
                    <div className="space-x-2">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                            if (editingProduct) {
                            const updated = {
                                ...editingProduct,
                                product_name: productEditForm.product_name,
                                description: productEditForm.description,
                            };
                            handleUpdateProduct(updated);
                            }
                        }}
                        >
                        Save
                        </button>

                      <button className="bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setEditingProduct(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold">{product.product_name}</h3>
                    <p className="text-gray-600">Category: {product.category_name}</p>
                    <p className="text-sm text-gray-500">{product.description}</p>
                    <div>
                      <h4 className="font-semibold">Price History</h4>
                      <ul className="list-disc pl-5 text-sm">
                        {product.price_history?.length > 0 ? (
                          product.price_history.map((price, idx) => (
                            <li key={`${product.product_id}-${price.price_date}-${idx}`}>
                              ${price.price} on {price.price_date}
                            </li>
                          ))
                        ) : (
                          <li key={`${product.product_id}-no-history`}>No price history available</li>
                        )}
                      </ul>
                    </div>
                    <div className="mt-2 space-x-2">
                      <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleDeleteProduct(product.product_id)}>Delete</button>
                      <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => handleEditProduct(product)}>Edit</button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
