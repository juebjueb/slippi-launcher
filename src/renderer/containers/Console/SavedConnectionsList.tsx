/** @jsx jsx */
import { DiscoveredConsoleInfo } from "@console/types";
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import { StoredConnection } from "@settings/types";
import { ConnectionStatus } from "@slippi/slippi-js";
import React from "react";

import { useConsoleDiscoveryStore } from "@/lib/hooks/useConsoleDiscovery";
import { useSettings } from "@/lib/hooks/useSettings";

import { SavedConnectionItem } from "./SavedConnectionItem";

export interface SavedConnectionsListProps {
  availableConsoles: DiscoveredConsoleInfo[];
  onDelete: (conn: StoredConnection) => void;
  onEdit: (conn: StoredConnection) => void;
}

export const SavedConnectionsList: React.FC<SavedConnectionsListProps> = ({ availableConsoles, onEdit, onDelete }) => {
  const [menuItem, setMenuItem] = React.useState<null | {
    index: number;
    anchorEl: HTMLElement;
  }>(null);

  const onOpenMenu = React.useCallback((index: number, target: any) => {
    setMenuItem({
      index,
      anchorEl: target,
    });
  }, []);

  const connectedConsoles = useConsoleDiscoveryStore((store) => store.connectedConsoles);
  const savedConnections = useSettings((store) => store.connections);

  const handleClose = () => {
    setMenuItem(null);
  };

  const handleDelete = () => {
    if (menuItem && menuItem.index >= 0) {
      onDelete(savedConnections[menuItem.index]);
    }
    handleClose();
  };

  const handleEdit = () => {
    if (menuItem && menuItem.index >= 0) {
      onEdit(savedConnections[menuItem.index]);
    }
    handleClose();
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      {savedConnections.length === 0 ? (
        <div>No saved connections</div>
      ) : (
        <div>
          {savedConnections.map((conn, index) => {
            const consoleStatus = connectedConsoles[conn.ipAddress];
            const status = consoleStatus?.status;
            const consoleInfo = availableConsoles.find((item) => item.ip === conn.ipAddress);
            return (
              <SavedConnectionItem
                key={conn.id}
                status={status ?? ConnectionStatus.DISCONNECTED}
                isAvailable={Boolean(consoleInfo)}
                currentFilename={consoleStatus?.filename ?? null}
                nickname={consoleStatus?.nickname ?? consoleInfo?.name}
                connection={conn}
                index={index}
                onOpenMenu={onOpenMenu}
              />
            );
          })}
        </div>
      )}
      <Menu anchorEl={menuItem ? menuItem.anchorEl : null} open={Boolean(menuItem)} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>
          <StyledListItemIcon>
            <CreateIcon fontSize="small" />
          </StyledListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <StyledListItemIcon>
            <DeleteIcon fontSize="small" />
          </StyledListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </div>
  );
};

const StyledListItemIcon = styled(ListItemIcon)`
  margin-right: 10px;
`;
