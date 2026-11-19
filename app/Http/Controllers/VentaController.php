<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Venta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VentaController extends Controller
{
    private function verificarEmprendedor(): void
    {
        $usuario = Auth::user();

        abort_unless(
            $usuario &&
            $usuario->rol === 'emprendedor' &&
            $usuario->activo,
            403
        );
    }

    public function index(): JsonResponse
    {
        $this->verificarEmprendedor();

        $ventas = Venta::with('detalles')
            ->where('user_id', Auth::id())
            ->orderByDesc('fecha_venta')
            ->get();

        return response()->json($ventas);
    }

    public function store(Request $request): JsonResponse
    {
        $this->verificarEmprendedor();

        $datos = $request->validate([
            'productos' => ['required', 'array', 'min:1'],
            'productos.*.producto_id' => [
                'required', 'integer', 'distinct'
            ],
            'productos.*.cantidad' => [
                'required', 'integer', 'min:1'
            ],
        ]);

        $venta = DB::transaction(function () use ($datos) {

            $venta = Venta::create([
                'user_id' => Auth::id(),
                'total' => 0,
                'fecha_venta' => now(),
            ]);

            $totalCentavos = 0;

            foreach ($datos['productos'] as $item) {

                $producto = Producto::query()
                    ->where('user_id', Auth::id())
                    ->whereKey($item['producto_id'])
                    ->firstOrFail();

                $cantidad = (int) $item['cantidad'];

                $actualizados = Producto::query()
                    ->whereKey($producto->id)
                    ->where('user_id', Auth::id())
                    ->where('stock', '>=', $cantidad)
                    ->decrement('stock', $cantidad);

                if ($actualizados !== 1) {
                    throw ValidationException::withMessages([
                        'productos' =>
                            'No hay stock suficiente para ' .
                            $producto->nombre . '.'
                    ]);
                }

                // Cálculo monetario en centavos
                $precioCentavos = (int) round(
                    (float) $producto->venta * 100
                );

                $subtotalCentavos = $precioCentavos * $cantidad;
                $totalCentavos += $subtotalCentavos;

                $venta->detalles()->create([
                    'producto_id' => $producto->id,
                    'nombre_producto' => $producto->nombre,
                    'cantidad' => $cantidad,
                    'precio_unitario' => number_format(
                        $precioCentavos / 100, 2, '.', ''
                    ),
                    'subtotal' => number_format(
                        $subtotalCentavos / 100, 2, '.', ''
                    ),
                ]);
            }

            $venta->update([
                'total' => number_format(
                    $totalCentavos / 100, 2, '.', ''
                ),
            ]);

            return $venta->load('detalles');
        });

        return response()->json([
            'message' => 'Venta registrada correctamente en SQLite.',
            'venta' => $venta,
        ], 201);
    }
}
