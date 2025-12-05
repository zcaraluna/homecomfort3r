import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const marca = searchParams.get('marca');
    const busqueda = searchParams.get('busqueda');
    const orden = searchParams.get('orden'); // 'asc' | 'desc'

    const where: any = {
      activo: true,
    };

    if (categoria && categoria !== 'todos') {
      where.categoria = {
        slug: categoria.toLowerCase(),
      };
    }

    if (marca && marca !== 'todos') {
      where.marca = {
        slug: marca.toLowerCase(),
      };
    }

    if (busqueda) {
      where.nombre = {
        contains: busqueda,
        mode: 'insensitive',
      };
    }

    const productos = await prisma.producto.findMany({
      where,
      include: {
        categoria: true,
        marca: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Ordenar por precio si se especifica
    let productosOrdenados = productos;
    if (orden === 'asc') {
      productosOrdenados = productos.sort((a, b) => {
        const precioA = a.precioOferta ? Number(a.precioOferta) : Number(a.precio);
        const precioB = b.precioOferta ? Number(b.precioOferta) : Number(b.precio);
        return precioA - precioB;
      });
    } else if (orden === 'desc') {
      productosOrdenados = productos.sort((a, b) => {
        const precioA = a.precioOferta ? Number(a.precioOferta) : Number(a.precio);
        const precioB = b.precioOferta ? Number(b.precioOferta) : Number(b.precio);
        return precioB - precioA;
      });
    }

    // Formatear productos para el frontend
    const productosFormateados = productosOrdenados.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      precioOferta: producto.precioOferta ? Number(producto.precioOferta) : null,
      ofertaDia: producto.ofertaDia,
      ofertaSemana: producto.ofertaSemana,
      ofertaMes: producto.ofertaMes,
      stock: producto.stock,
      imagen: producto.imagen,
      categoria: producto.categoria.nombre,
      marca: producto.marca.nombre,
    }));

    return NextResponse.json({
      success: true,
      productos: productosFormateados,
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los productos',
      },
      { status: 500 }
    );
  }
}

