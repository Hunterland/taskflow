import { Injectable } from '@angular/core';
import { usersControllerFindOptions } from '../api/generated/users/users';
import type { UserOption } from '../models/user-option.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  getOptions(search?: string): Promise<UserOption[]> {
    return usersControllerFindOptions({
      search: search?.trim() || undefined,
    });
  }
}
