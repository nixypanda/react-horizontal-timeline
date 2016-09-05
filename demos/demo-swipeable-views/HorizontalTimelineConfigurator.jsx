import React, { PropTypes } from 'react';

const HorizontalTimelineConfigurator = (props) => {
  return (
    <div className={'container'} style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
      <h2 className='text-center' style={{ flex: 1 }} >Configure the Timeline</h2>

      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, fontSize: 20 }}>Padding between events</div>
        <div style={{ flex: 1 }}>
          <label>Minimum</label>
          &nbsp;
          <input
            max={props.maxEventPadding}
            min={20}
            onChange={(e) => {
              props.setConfig('minEventPadding', Number(e.target.value));
            }}
            type='number'
            value={props.minEventPadding}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label>Maximum</label>
          &nbsp;
          <input
            min={props.minEventPadding}
            onChange={(e) => {
              props.setConfig('maxEventPadding', Number(e.target.value));
            }}
            type='number'
            value={props.maxEventPadding}
          />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, fontSize: 20 }}>Endings</div>
        <div style={{ flex: 1 }}>
          <label>Open beginning</label>
          <input
            checked={props.isOpenBeginning}
            onChange={(e) => {
              props.setConfig('isOpenBeginning', e.target.checked);
            }}
            type='checkbox'
          />
          <label>Open ending</label>
          <input
            checked={props.isOpenEnding}
            onChange={(e) => {
              props.setConfig('isOpenEnding', e.target.checked);
            }}
            type='checkbox'
          />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, fontSize: 20 }}>Line Padding</div>
        <div style={{ flex: 1 }}>
          <input
            min={0}
            onChange={(e) => {
              props.setConfig('linePadding', Number(e.target.value));
            }}
            type='number'
            value={props.linePadding}
          />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, fontSize: 20 }}>LabelWidth</div>
        <div style={{ flex: 1 }}>
          <input
            min={0}
            onChange={(e) => {
              props.setConfig('labelWidth', Number(e.target.value));
            }}
            type='number'
            value={props.labelWidth}
          />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, fontSize: 20 }}>Filling Motion</div>

        <div style={{ flex: 1 }} >
          <label>Stiffness</label>
          &nbsp;
          <input
            min={0}
            onChange={(e) => {
              props.setConfig('fillingMotionStiffness', Number(e.target.value));
            }}
            type='number'
            value={props.fillingMotionStiffness}
          />
        </div>

        <div style={{ flex: 1 }} >
          <label>Damping</label>
          &nbsp;
          <input
            min={0}
            onChange={(e) => {
              props.setConfig('fillingMotionDamping', Number(e.target.value));
            }}
            type='number'
            value={props.fillingMotionDamping}
          />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, fontSize: 20 }} >Sliding Motion</div>

        <div style={{ flex: 1 }} >
          <label>Stiffness</label>
          &nbsp;
          <input
            min={0}
            onChange={(e) => {
              props.setConfig('slidingMotionStiffness', Number(e.target.value));
            }}
            type='number'
            value={props.slidingMotionStiffness}
          />
        </div>

        <div style={{ flex: 1 }} >
          <label >Damping</label>
          &nbsp;
          <input
            min={0}
            onChange={(e) => {
              props.setConfig('slidingMotionDamping', Number(e.target.value));
            }}
            type='number'
            value={props.slidingMotionDamping}
          />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 3, fontSize: 20 }}>Styling</div>

        <div style={{ flex: 1 }}>
          <label>Background</label>
          &nbsp;
          <input
            onChange={(e) => {
              props.setConfig('stylesBackground', e.target.value);
            }}
            type='color'
            value={props.stylesBackground}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label >Foreground</label>
          &nbsp;
          <input
            onChange={(e) => {
              props.setConfig('stylesForeground', e.target.value);
            }}
            type='color'
            value={props.stylesForeground}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label >Outline</label>
          &nbsp;
          <input
            onChange={(e) => {
              props.setConfig('stylesOutline', e.target.value);
            }}
            type='color'
            value={props.stylesOutline}
          />
        </div>
      </div>

    </div>
  );
};

HorizontalTimelineConfigurator.propTypes = {
  fillingMotionStiffness: PropTypes.number.isRequired,
  fillingMotionDamping: PropTypes.number.isRequired,
  isOpenEnding: PropTypes.func.isRequired,
  isOpenBeginning: PropTypes.func.isRequired,
  linePadding: PropTypes.number.isRequired,
  labelWidth: PropTypes.number.isRequired,
  maxEventPadding: PropTypes.number.isRequired,
  minEventPadding: PropTypes.number.isRequired,
  setConfig: PropTypes.func.isRequired,
  slidingMotionStiffness: PropTypes.number.isRequired,
  slidingMotionDamping: PropTypes.number.isRequired,
  stylesBackground: PropTypes.string.isRequired,
  stylesForeground: PropTypes.string.isRequired,
  stylesOutline: PropTypes.string.isRequired
};

export default HorizontalTimelineConfigurator;
