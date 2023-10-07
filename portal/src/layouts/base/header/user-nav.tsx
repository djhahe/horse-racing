import { useAccount, useDisconnect } from '@casperdash/usewallet';

import { GradientAvatar } from '@/components/common/avatar/gradient-avatar';
import { MiddleTruncatedText } from '@/components/common/middle-truncated-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { PathsEnum } from '@/enums/paths';

export function UserNav() {
  const navigate = useNavigate();
  const { publicKey } = useAccount();
  const { disconnect } = useDisconnect({
    onSuccess: () => {
      navigate(PathsEnum.HOME);
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar>
            <GradientAvatar name={publicKey ?? ''} />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <MiddleTruncatedText>{publicKey}</MiddleTruncatedText>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={disconnect}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
