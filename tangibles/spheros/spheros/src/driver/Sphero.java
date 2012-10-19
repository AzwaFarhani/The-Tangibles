package driver;

import listener.RobotListener;
import se.nicklasgavelin.bluetooth.BluetoothDevice;
import se.nicklasgavelin.sphero.Robot;
import se.nicklasgavelin.sphero.command.SetDataStreamingCommand;
import se.nicklasgavelin.sphero.command.SetDataStreamingCommand.DATA_STREAMING_MASKS;
import se.nicklasgavelin.sphero.exception.InvalidRobotAddressException;
import se.nicklasgavelin.sphero.exception.RobotBluetoothException;
import utils.Event;

public class Sphero extends Robot {
	private boolean active = false;

	public Sphero(BluetoothDevice bt) throws InvalidRobotAddressException,
			RobotBluetoothException {
		super(bt);
	}

	@Override
	public boolean equals(Object s) {
		if (s instanceof Sphero)
			return ((Sphero) s).getId().equals(getId());
		else if (s instanceof String)
			return ((String) s).equals(getId());
		return false;
	}

	public void activateEvents(Event[] events) {
		if (!active) {
			RobotListener listener = new RobotListener(events, getId());
			addListener(listener);

			sendCommand(new SetDataStreamingCommand(10, 17,
					DATA_STREAMING_MASKS.ACCELEROMETER.ALL.FILTERED, 200));
			sendCommand(new SetDataStreamingCommand(10, 17,
					DATA_STREAMING_MASKS.GYRO.ALL.FILTERED, 999));
		}
		active = true;
	}
}
