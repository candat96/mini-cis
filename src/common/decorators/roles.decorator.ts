import { Reflector } from '@nestjs/core';

// Todo: Replace any with role enum if it exists
export const Roles = Reflector.createDecorator<any[]>();
