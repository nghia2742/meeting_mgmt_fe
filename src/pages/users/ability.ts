// ability.ts
import { AbilityBuilder, Ability } from '@casl/ability';

export default function defineAbilityFor(role: string) {
    const { can, cannot, build } = new AbilityBuilder(Ability);

    if (role === 'admin') {
        can('read', 'all');
    } else {
        cannot('read', 'User');
    }

    

    return build();
}
