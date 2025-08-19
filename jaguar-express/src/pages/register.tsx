'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store';
import { isValidEmail, isValidPhone, validatePassword } from '@/utils';
import { toast } from 'react-hot-toast';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  nombre?: string;
  email?: string;
  telefono?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    // Validar teléfono
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!isValidPhone(formData.telefono)) {
      newErrors.telefono = 'Ingresa un teléfono válido (ej: 3001234567)';
    }

    // Validar contraseña
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar términos
    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        nombre: formData.nombre.trim(),
        email: formData.email.toLowerCase(),
        telefono: formData.telefono,
        password: formData.password,
      });
      router.push('/');
    } catch (error: any) {
      console.error('Register error:', error);
      // El error ya se muestra en el store
    }
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-jaguar-500 to-jaguar-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <span className="font-bold text-2xl text-gray-900">
                Jaguar Express
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Crear Cuenta
            </h2>
            <p className="text-gray-600">
              Únete a Jaguar Express y disfruta de entregas rápidas
            </p>
          </div>

          {/* Formulario */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Registro</CardTitle>
              <CardDescription className="text-center">
                Completa tus datos para crear tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.nombre}
                      onChange={handleInputChange('nombre')}
                      error={errors.nombre}
                      className="pl-10"
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      error={errors.email}
                      className="pl-10"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="3001234567"
                      value={formData.telefono}
                      onChange={handleInputChange('telefono')}
                      error={errors.telefono}
                      className="pl-10"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      error={errors.password}
                      className="pl-10 pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirma tu contraseña"
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      error={errors.confirmPassword}
                      className="pl-10 pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Términos y condiciones */}
                <div className="space-y-2">
                  <div className="flex items-start">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked);
                        if (errors.terms) {
                          setErrors(prev => ({ ...prev, terms: undefined }));
                        }
                      }}
                      className="h-4 w-4 text-jaguar-600 focus:ring-jaguar-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      Acepto los{' '}
                      <Link href="/terms" className="text-jaguar-600 hover:text-jaguar-500">
                        términos y condiciones
                      </Link>
                      {' '}y la{' '}
                      <Link href="/privacy" className="text-jaguar-600 hover:text-jaguar-500">
                        política de privacidad
                      </Link>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-red-600">{errors.terms}</p>
                  )}
                </div>

                {/* Botón de envío */}
                <Button
                  type="submit"
                  variant="jaguar"
                  size="lg"
                  className="w-full"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
                  </div>
                </div>
              </div>

              {/* Link a login */}
              <div className="mt-6 text-center">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}