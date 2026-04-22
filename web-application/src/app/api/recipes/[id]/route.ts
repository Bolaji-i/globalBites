import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { getRecipeById, updateRecipe, deleteRecipe } from '@/lib/recipes';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/recipes/[id]
 * Get a single recipe by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const recipe = await getRecipeById(id);

    if (!recipe) {
      return NextResponse.json(
        { error: 'Not found', message: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Check if recipe is published or if the requester is the author
    const session = await auth();
    if (!recipe.published && recipe.authorId !== session?.user?.id) {
      return NextResponse.json(
        { error: 'Not found', message: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Get recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/recipes/[id]
 * Update a recipe
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to update a recipe' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const existingRecipe = await getRecipeById(id);

    if (!existingRecipe) {
      return NextResponse.json(
        { error: 'Not found', message: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (existingRecipe.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You can only edit your own recipes' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      image,
      cuisine,
      country,
      difficulty,
      prepTime,
      cookTime,
      servings,
      ingredients,
      steps,
      tags,
      published,
    } = body;

    // Validate title if provided
    if (title !== undefined && !title?.trim()) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Recipe title cannot be empty' },
        { status: 400 }
      );
    }

    const recipe = await updateRecipe(id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description?.trim() }),
      ...(image !== undefined && { image }),
      ...(cuisine !== undefined && { cuisine: cuisine?.trim() }),
      ...(country !== undefined && { country: country?.trim() }),
      ...(difficulty !== undefined && { difficulty }),
      ...(prepTime !== undefined && { prepTime: prepTime ? parseInt(prepTime) : undefined }),
      ...(cookTime !== undefined && { cookTime: cookTime ? parseInt(cookTime) : undefined }),
      ...(servings !== undefined && { servings: servings ? parseInt(servings) : undefined }),
      ...(ingredients !== undefined && { ingredients }),
      ...(steps !== undefined && { steps }),
      ...(tags !== undefined && { tags }),
      ...(published !== undefined && { published }),
    });

    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    console.error('Update recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recipes/[id]
 * Delete a recipe
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to delete a recipe' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const existingRecipe = await getRecipeById(id);

    if (!existingRecipe) {
      return NextResponse.json(
        { error: 'Not found', message: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (existingRecipe.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You can only delete your own recipes' },
        { status: 403 }
      );
    }

    await deleteRecipe(id);

    return NextResponse.json({ success: true, message: 'Recipe deleted' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}
