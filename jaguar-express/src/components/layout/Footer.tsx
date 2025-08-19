'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar suscripción al newsletter
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenido principal del footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-jaguar-500 to-jaguar-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="font-bold text-xl">Jaguar Express</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tu plataforma de delivery favorita. Conectamos a los mejores restaurantes 
              y tiendas con tu hogar, ofreciendo entregas rápidas y seguras.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="text-gray-300 hover:text-white transition-colors">
                  Restaurantes
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gray-300 hover:text-white transition-colors">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Ayuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Información legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/partner" className="text-gray-300 hover:text-white transition-colors">
                  Únete como Socio
                </Link>
              </li>
              <li>
                <Link href="/driver" className="text-gray-300 hover:text-white transition-colors">
                  Ser Repartidor
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto y newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-jaguar-400" />
                <span className="text-gray-300">+57 300 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-jaguar-400" />
                <span className="text-gray-300">info@jaguarexpress.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-jaguar-400 mt-0.5" />
                <span className="text-gray-300">
                  Calle 123 #45-67<br />
                  Bogotá, Colombia
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-4">
              <h4 className="font-medium mb-2">Newsletter</h4>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Tu email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button type="submit" variant="jaguar" size="sm" className="w-full">
                  Suscribirse
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800" />

        {/* Copyright y información adicional */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            © {currentYear} Jaguar Express. Todos los derechos reservados.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Disponible 24/7</span>
            <span>•</span>
            <span>Entrega en 30-45 min</span>
            <span>•</span>
            <span>Pago seguro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}