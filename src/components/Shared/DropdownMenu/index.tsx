import IconButton from '@material-ui/core/IconButton';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MoreIcon from 'mdi-react/MoreIcon';
import MoreVertIcon from 'mdi-react/MoreVertIcon';
import * as React from 'react';

import OptionItem from './OptionItem';

export interface IOption {
  text: string;
  icon?: typeof MoreIcon;
  handler: () => void;
}

interface IState {
  targetElem?: HTMLElement;
}

interface IProps extends Partial<MenuProps> {
  options: IOption[];
}

export default class DropdownMenu extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ targetElem: event.currentTarget });
  }

  handleClose = () => {
    this.setState({ targetElem: null });
  }

  handleClick = (option: IOption) => {
    this.handleClose();
    option.handler();
  }

  render() {
    const { targetElem } = this.state;
    const { options, ...menuProps } = this.props;

    return (
      <div>
        <IconButton onClick={this.handleOpen} color='inherit'>
          <MoreVertIcon />
        </IconButton>

        <Menu
          {...menuProps}
          anchorEl={targetElem}
          open={!!targetElem}
          onClose={this.handleClose}
        >
          {options.map(option =>
            <OptionItem key={option.text} option={option} onClick={this.handleClick} />
          )}
        </Menu>
      </div>
    );
  }
}