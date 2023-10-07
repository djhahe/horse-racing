import { useAccount } from '@casperdash/usewallet';

import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import GameLogo from '@/assets/icons/game-ps.svg';
import { LoginDialog } from '@/modules/core/login-dialog';

export const Header = () => {
  const { publicKey } = useAccount();
  return (
    <div>
      <div className="flex h-16 items-center px-4">
        <div>
          <img src={GameLogo} alt="Game Portal" className="h-8" />
        </div>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          {publicKey ? (
            <UserNav />
          ) : (
            <div>
              <LoginDialog />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
