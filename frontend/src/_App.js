import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import {
  BiZoomIn,
  BiZoomOut,
  BiTrash,
  BiText,
  BiImage,
  BiCircle,
  BiRectangle,
} from 'react-icons/bi';
import { BsSlashLg } from 'react-icons/bs';
import {
  MdClear,
  MdFlipToFront,
  MdFlipToBack,
  MdColorize,
} from 'react-icons/md';
import { FaImage } from 'react-icons/fa6';

export default function App() {
  const { editor, onReady } = useFabricJSEditor();

  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
  }, []);

  useEffect(() => {
    if (backgroundColor) {
      editor?.canvas?.setBackgroundColor(backgroundColor);
      editor?.canvas?.renderAll();
    }
  }, [backgroundColor]);

  const addRectangle = () => {
    editor.addRectangle();
  };

  const addText = () => {
    editor.addText('Add text');
  };

  const addLine = () => {
    editor.addLine();
  };

  const addCircle = () => {
    editor.addCircle();
  };

  const clear = () => {
    editor.deleteAll();
  };

  const deleteSelected = () => {
    editor.deleteSelected();
  };

  const zoomIn = () => editor?.zoomIn();
  const zoomOut = () => editor?.zoomOut();

  // const moveFront = () => editor?.canvas?._activeObject?.bringForward();
  // const moveBack = () => editor?.canvas?._activeObject?.sendBackwards();

  const backgroundImageHandler = (e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader();

      reader.onloadend = () => {
        editor?.canvas?.setBackgroundImage(
          reader.result,
          editor?.canvas.renderAll.bind(editor.canvas)
        );
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const canvasImageHandler = (e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader();

      reader.onloadend = () => {
        editor?.setTimeout(() => editor?.canvas?.renderAll(), 1000);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  window.fabric = fabric;

  return (
    <div className='m-3 flex flex-col gap-3'>
      <div className='flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center px-3 gap-3 md:gap-0'>
        <h4>#Frame 1</h4>
        <div className='flex flex-row gap-3'>
          <div className='flex flex-row gap-2 items-center'>
            <label htmlFor='backgroundImage'>
              <FaImage
                className='cursor-pointer'
                title='Add background image'
              />
            </label>
            <input
              type='file'
              id='backgroundImage'
              className='hidden'
              onChange={backgroundImageHandler}
            />
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <label htmlFor='backgroundColor'>
              <MdColorize
                className='cursor-pointer'
                title='Add background color'
              />
            </label>
            <input
              type='color'
              id='backgroundColor'
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </div>
        </div>
      </div>
      <FabricJSCanvas
        className='min-h-[80vh] flex-1 shrink-0 border border-gray-400 shadow-md rounded-lg'
        onReady={onReady}
      />
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center px-3 gap-3 md:gap-0'>
        <div className='flex flex-wrap flex-row gap-3'>
          <button
            title='Add text'
            onClick={addText}
            className='px-2 py-2 bg-blue-400 text-white rounded-lg'
          >
            <BiText />
          </button>

          <input
            type='file'
            id='canvasImage'
            className='hidden'
            onChange={canvasImageHandler}
          />
          <label htmlFor='canvasImage'>
            <button
              title='Add image'
              className='px-2 py-2 bg-blue-400 text-white rounded-lg'
            >
              <BiImage />
            </button>
          </label>

          <button
            title='Add circle'
            onClick={addCircle}
            className='px-2 py-2 bg-blue-400 text-white rounded-lg'
          >
            <BiCircle />
          </button>
          <button
            title='Add rectangle'
            onClick={addRectangle}
            className='px-2 py-2 bg-blue-400 text-white rounded-lg'
          >
            <BiRectangle />
          </button>
          <button
            title='Add line'
            onClick={addLine}
            className='px-2 py-2 bg-blue-400 text-white rounded-lg'
          >
            <BsSlashLg />
          </button>
        </div>
        <div className='flex flex-wrap flex-row gap-3'>
          {/* <button
            title='Move to front'
            onClick={moveFront}
            className='px-2 py-2 bg-black text-white rounded-lg'
          >
            <MdFlipToFront />
          </button>
          <button
            title='Move to back'
            onClick={moveBack}
            className='px-2 py-2 bg-black text-white rounded-lg'
          >
            <MdFlipToBack />
          </button> */}

          <button
            title='Zoom in'
            onClick={zoomIn}
            className='px-2 py-2 bg-black text-white rounded-lg'
          >
            <BiZoomIn />
          </button>
          <button
            title='Zoom out'
            onClick={zoomOut}
            className='px-2 py-2 bg-black text-white rounded-lg'
          >
            <BiZoomOut />
          </button>
          <button
            title='Delete selected'
            onClick={deleteSelected}
            className='px-2 py-2 bg-rose-600 text-white rounded-lg'
          >
            <BiTrash />
          </button>
          <button
            title='Clear frame'
            onClick={clear}
            className='px-2 py-2 bg-slate-400 text-white rounded-lg'
          >
            <MdClear />
          </button>
        </div>
      </div>
    </div>
  );
}
