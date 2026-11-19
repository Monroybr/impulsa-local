<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProductoController extends Controller
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

    // Consultar los productos del emprendedor autenticado
    public function index(): JsonResponse
    {
        $this->verificarEmprendedor();

        return response()->json(
            Producto::where('user_id', Auth::id())
                ->orderBy('nombre')
                ->get()
        );
    }

    // Registrar un nuevo producto
    public function store(Request $request): JsonResponse
    {
        $this->verificarEmprendedor();

        $datos = $request->validate($this->reglas());

        $datos['user_id'] = Auth::id();

        $producto = Producto::create($datos);

        return response()->json($producto, 201);
    }

    // Actualizar un producto existente
    public function update(
        Request $request,
        Producto $producto
    ): JsonResponse {
        $this->verificarEmprendedor();

        abort_unless(
            $producto->user_id === Auth::id(),
            404
        );

        $datos = $request->validate(
            $this->reglas($producto)
        );

        $producto->update($datos);

        return response()->json($producto->fresh());
    }

    // Eliminar un producto
    public function destroy(Producto $producto): JsonResponse
    {
        $this->verificarEmprendedor();

        abort_unless(
            $producto->user_id === Auth::id(),
            404
        );

        $producto->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente.'
        ]);
    }

    // Validaciones para crear y actualizar productos
    private function reglas(?Producto $producto = null): array
    {
        $codigo = Rule::unique('productos', 'codigo')
            ->where(
                fn ($query) =>
                $query->where('user_id', Auth::id())
            );

        if ($producto) {
            $codigo->ignore($producto->id);
        }

        return [
            'codigo' => [
                'required',
                'string',
                'max:30',
                $codigo
            ],

            'nombre' => [
                'required',
                'string',
                'max:100'
            ],

            'categoria' => [
                'required',
                'string',
                'max:100'
            ],

            'compra' => [
                'required',
                'numeric',
                'min:0',
                'max:9999999999.99'
            ],

            'venta' => [
                'required',
                'numeric',
                'min:0',
                'max:9999999999.99'
            ],

            'stock' => [
                'required',
                'integer',
                'min:0'
            ],
        ];
    }
}
