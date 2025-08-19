'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Clock, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { useLocationStore, useUIStore } from '@/store';
import { negociosApi } from '@/lib/api';
import { Negocio, TipoNegocio } from '@/types';
import { formatCurrency, getBusinessTypeIcon, isBusinessOpen } from '@/utils';
import { toast } from 'react-hot-toast';

interface CategoryCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

function CategoryCard({ icon, title, description, href }: CategoryCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

interface BusinessCardProps {
  negocio: Negocio;
}

function BusinessCard({ negocio }: BusinessCardProps) {
  const isOpen = isBusinessOpen(negocio.horarioApertura, negocio.horarioCierre);
  
  return (
    <Link href={`/restaurant/${negocio.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
        <div className="relative">
          <img
            src={negocio.imagen || `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=restaurant%20${encodeURIComponent(negocio.nombre)}&image_size=landscape_4_3`}
            alt={negocio.nombre}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge variant={isOpen ? 'success' : 'destructive'}>
              {isOpen ? 'Abierto' : 'Cerrado'}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90">
              {getBusinessTypeIcon(negocio.tipo)}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg truncate">{negocio.nombre}</h3>
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{negocio.calificacion?.toFixed(1) || '4.5'}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {negocio.descripcion}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>30-45 min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Truck className="h-4 w-4" />
              <span>{formatCurrency(3500)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function HomePage() {
  const { currentLocation, getCurrentLocation } = useLocationStore();
  const { searchQuery, setSearchQuery } = useUIStore();
  const [popularBusinesses, setPopularBusinesses] = useState<Negocio[]>([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentLocation]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar negocios populares
      const popular = await negociosApi.getPopular();
      setPopularBusinesses(popular.slice(0, 6));
      
      // Cargar negocios cercanos si hay ubicación
      if (currentLocation) {
        const nearby = await negociosApi.getNearby(
          currentLocation.lat,
          currentLocation.lng,
          5
        );
        setNearbyBusinesses(nearby.slice(0, 6));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationRequest = async () => {
    try {
      await getCurrentLocation();
      toast.success('Ubicación obtenida correctamente');
    } catch (error) {
      toast.error('No se pudo obtener la ubicación');
    }
  };

  const categories = [
    {
      icon: '🍽️',
      title: 'Restaurantes',
      description: 'Comida deliciosa de tus lugares favoritos',
      href: '/restaurants?type=restaurante',
    },
    {
      icon: '💊',
      title: 'Farmacias',
      description: 'Medicamentos y productos de salud',
      href: '/restaurants?type=farmacia',
    },
    {
      icon: '🛒',
      title: 'Supermercados',
      description: 'Todo lo que necesitas para tu hogar',
      href: '/restaurants?type=supermercado',
    },
    {
      icon: '🏪',
      title: 'Tiendas',
      description: 'Productos variados cerca de ti',
      href: '/restaurants?type=tienda',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-jaguar-600 to-jaguar-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tu comida favorita,
              <br />
              <span className="text-jaguar-200">entregada rápido</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-jaguar-100">
              Descubre los mejores restaurantes y tiendas cerca de ti
            </p>
            
            {/* Búsqueda principal */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-2 shadow-lg">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar restaurantes, productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-0 focus:ring-0 text-gray-900"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleLocationRequest}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    {currentLocation ? 'Ubicación detectada' : 'Detectar ubicación'}
                  </Button>
                  <Button variant="jaguar" size="lg">
                    Buscar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Qué estás buscando?
            </h2>
            <p className="text-lg text-gray-600">
              Explora nuestras categorías y encuentra lo que necesitas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Negocios populares */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Populares en tu zona
              </h2>
              <p className="text-gray-600">
                Los favoritos de otros usuarios
              </p>
            </div>
            <Link href="/restaurants">
              <Button variant="outline">
                Ver todos
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded mb-3" />
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-16" />
                      <div className="h-3 bg-gray-200 rounded w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularBusinesses.map((negocio) => (
                <BusinessCard key={negocio.id} negocio={negocio} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Negocios cercanos */}
      {nearbyBusinesses.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Cerca de ti
                </h2>
                <p className="text-gray-600">
                  Entrega rápida desde tu ubicación
                </p>
              </div>
              <Link href="/restaurants?nearby=true">
                <Button variant="outline">
                  Ver todos
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyBusinesses.map((negocio) => (
                <BusinessCard key={negocio.id} negocio={negocio} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-jaguar-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tienes un negocio?
          </h2>
          <p className="text-xl mb-8 text-jaguar-100">
            Únete a Jaguar Express y llega a más clientes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Registrar mi negocio
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-jaguar-600">
              Ser repartidor
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}