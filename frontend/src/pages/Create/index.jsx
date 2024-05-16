import React from 'react';

import {
  Fieldset,
  Input,
  Label,
  Legend,
  Field,
  Button,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Switch,
  Select,
} from '@headlessui/react';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { FaTrashCan } from 'react-icons/fa6';

import { FaPlus } from 'react-icons/fa';
import Color from '../../components/Forms/Color';
import ErrorMessage from '../../components/Forms/ErrorMessage';

import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const TEXT_TEMPLATE = {
  content: '',
  x: 0,
  y: 0,
  color: '#000000',
  size: 40,
};

const IMAGE_TEMPLATE = {
  url: '',
  x: 0,
  y: 0,
  width: 200,
  height: 200,
};

const BACKGROUND_TYPES = ['color', 'image'];

const FRAME_TEMPLATE = {
  includeImage: false,
  texts: [TEXT_TEMPLATE],
  images: [IMAGE_TEMPLATE],
  backgroundType: BACKGROUND_TYPES[0],
  background: '#000000',
  audioUrl: '',
};

const frameSchema = yup.object().shape({
  frames: yup
    .array()
    .of(
      yup.object().shape({
        includeImage: yup.boolean().optional(),
        texts: yup
          .array()
          .of(
            yup.object().shape({
              content: yup.string().required('Content is required'),
              x: yup
                .number('Value should be number')
                .required('X-axis position is required'),
              y: yup
                .number('Value should be number')
                .required('Y-axis position is required'),
              size: yup
                .number('Value should be number')
                .required('Size is required'),
              color: yup
                .string()
                .required('Color is required')
                .test(
                  'hex-code-validator',
                  'Invalid hex code for text color',
                  (value) => /^#[0-9A-F]{3}$|^#[0-9A-F]{6}$/i.test(value)
                ),
            })
          )
          .required(),
        images: yup
          .array()
          .when('includeImage', {
            is: true,
            then: () =>
              yup
                .array()
                .of(
                  yup.object().shape({
                    url: yup
                      .string()
                      .url('Invalid image url')
                      .required('Url is required'),
                    x: yup
                      .number('Value should be number')
                      .required('X-axis position is required'),
                    y: yup
                      .number('Value should be number')
                      .required('Y-axis position is required'),
                    width: yup
                      .number('Value should be number')
                      .required('Width is required'),
                    height: yup
                      .number('Value should be number')
                      .required('Height is required'),
                  })
                )
                .required(),
          })
          .required(),
        backgroundType: yup
          .string()
          .required('Background type is required')
          .oneOf(BACKGROUND_TYPES, 'Invalid value'),
        background: yup
          .string()
          .required('Value is required')
          .when('backgroundType', {
            is: BACKGROUND_TYPES[0],
            then: () =>
              yup
                .string()
                .test('hex-code-validator', 'Invalid hex code', (value) =>
                  /^#[0-9A-F]{3}$|^#[0-9A-F]{6}$/i.test(value)
                )
                .required('Background color is required'),
          })
          .when('backgroundType', {
            is: BACKGROUND_TYPES[1],
            then: () =>
              yup
                .string()
                .url('Invalid background image url')
                .required('Background image is required'),
          }),
        audioUrl: yup.string().url('Invalid audio url').optional(),
      })
    )
    .required(),
});

const Create = () => {
  const formik = useFormik({
    initialValues: {
      frames: [FRAME_TEMPLATE],
    },
    validationSchema: frameSchema,
    onSubmit: (data) => submitData(data),
  });

  const navigate = useNavigate();

  const addFrame = () => {
    formik.setFieldValue(`frames`, [
      ...formik.values['frames'],
      FRAME_TEMPLATE,
    ]);
  };

  const addText = (index) => {
    formik.setFieldValue(`frames.${index}.texts`, [
      ...formik.values['frames'][index].texts,
      TEXT_TEMPLATE,
    ]);
  };

  const addImage = (index) => {
    formik.setFieldValue(`frames.${index}.images`, [
      ...formik.values['frames'][index].images,
      IMAGE_TEMPLATE,
    ]);
  };

  const deleteFor = (key, index, forIndex) => {
    if (formik?.values?.['frames']?.[index]?.[key]?.length > 1) {
      const els = [...formik.values['frames'][index][key]];

      els.splice(forIndex, 1);

      formik.setFieldValue(`frames.${index}.${key}`, [...els]);
    }
  };

  const deleteFrame = (index) => {
    if (formik?.values?.['frames']?.length > 1) {
      const els = [...formik.values['frames']];

      els.splice(index, 1);

      formik.setFieldValue(`frames`, [...els]);
    }
  };

  const submitData = async (formData) => {
    let response = null;

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/generateFrame`,
        formData?.frames ?? []
      );

      response = data;

      if (response?.success) {
        toast.success(response?.message);
      }
    } catch (error) {
      if (response?.message) {
        toast.error(response?.message);
      }
    } finally {
      if (response?.id) {
        navigate(`/videos/${response?.id}/status`);
      }
    }
  };

  const cpFromFrame = (e) => {
    const from = e.target.value;
    const to = e.target.selectedOptions[0]?.dataset?.to ?? null;

    if (from == null || to == null) {
      return;
    }

    formik.setFieldValue(`frames.${to}`, {
      ...formik.values['frames'][from],
    });
  };

  return (
    <div className=' container mx-auto h-full py-10 px-4'>
      <form
        className='flex flex-col justify-start items-start gap-4'
        onSubmit={formik.handleSubmit}
      >
        {formik.values['frames'].map((frame, index) => (
          <div
            key={`frame-${index}`}
            className='w-full bg-white p-4 px-6 rounded-md shadow-lg z-10'
          >
            <div className='flex justify-between items-center gap-2'>
              <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
                #Frame {index + 1}
              </h2>

              <div className='flex justify-center items-center gap-2 mb-2'>
                {formik.values['frames'].length > 1 && (
                  <Field>
                    <Select
                      className={`w-full rounded-md border border-[#e0e0e0] bg-white p-2 text-xs font-medium text-[#6B7280] outline-none border-r-8 border-transparent outline outline-[#e0e0e0]/50`}
                      onChange={cpFromFrame}
                    >
                      <option
                        value={null}
                        data-from={null}
                        className='first-letter:uppercase'
                      >
                        Copy frames
                      </option>
                      {formik.values['frames'].map((_, index__) => {
                        if (index__ == index) {
                          return null;
                        }
                        return (
                          <option
                            key={`frames-${index__}-copy-select`}
                            value={index__}
                            data-to={index}
                            className='first-letter:uppercase'
                          >
                            Copy Frame #{index__ + 1}
                          </option>
                        );
                      })}
                    </Select>
                  </Field>
                )}
                {index === 0 && (
                  <Button
                    onClick={() => addFrame()}
                    title='Add frame'
                    className={
                      'hover:bg-[#6A64F1]/90 rounded-md bg-[#6A64F1] p-2 text-center text-base font-semibold text-white outline-none'
                    }
                  >
                    <FaPlus />
                  </Button>
                )}
                {formik.values['frames'].length > 1 && (
                  <Button
                    title={`Delete frame ${index + 1}`}
                    className={
                      'hover:bg-rose-600/90 rounded-md bg-rose-600 p-2 text-center text-base font-semibold text-white outline-none'
                    }
                    onClick={() => deleteFrame(index)}
                  >
                    <FaTrashCan />
                  </Button>
                )}
              </div>
            </div>

            <TabGroup>
              <TabList className='flex gap-4'>
                <Tab className='w-full rounded-lg bg-[#e5e5e5] py-3 text-sm/6 font-semibold text-[#aeadae] focus:outline-none data-[selected]:bg-[#6A64F1] hover:bg-[#6A64F1] hover:text-white data-[selected]:text-white data-[selected]:data-[hover]:bg-[#6A64F1] data-[focus]:outline-1 data-[focus]:outline-white'>
                  Text
                </Tab>
                <Tab className='w-full rounded-lg bg-[#e5e5e5] py-3 text-sm/6 font-semibold text-[#aeadae] focus:outline-none data-[selected]:bg-[#6A64F1] hover:bg-[#6A64F1] hover:text-white data-[selected]:text-white data-[selected]:data-[hover]:bg-[#6A64F1] data-[focus]:outline-1 data-[focus]:outline-white'>
                  Images
                </Tab>
                <Tab className='w-full rounded-lg bg-[#e5e5e5] py-3 text-sm/6 font-semibold text-[#aeadae] focus:outline-none data-[selected]:bg-[#6A64F1] hover:bg-[#6A64F1] hover:text-white data-[selected]:text-white data-[selected]:data-[hover]:bg-[#6A64F1] data-[focus]:outline-1 data-[focus]:outline-white'>
                  Others
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel className='rounded-xl bg-white/5 p-3'>
                  {frame.texts.map((text, textIndex) => (
                    <Fieldset
                      className='space-y-4 mt-2 border-t-2 border-b-2 border-gray-300 py-4'
                      key={`frames-${index}-text-${textIndex}`}
                    >
                      <Legend className='text-lg font-bold flex justify-between items-center'>
                        <span className='block'>{`Text ${textIndex + 1}`}</span>
                        <div className='flex justify-center items-center gap-2'>
                          {textIndex === 0 && (
                            <Button
                              onClick={() => addText(index)}
                              title='Add text'
                              className={
                                'hover:bg-[#6A64F1]/90 rounded-md bg-[#6A64F1] p-2 text-center text-base font-semibold text-white outline-none'
                              }
                            >
                              <FaPlus />
                            </Button>
                          )}
                          {frame.texts.length > 1 && (
                            <Button
                              title={`Delete Text ${textIndex + 1}`}
                              className={
                                'hover:bg-rose-600/90 rounded-md bg-rose-600 p-2 text-center text-base font-semibold text-white outline-none'
                              }
                              onClick={() =>
                                deleteFor('texts', index, textIndex)
                              }
                            >
                              <FaTrashCan />
                            </Button>
                          )}
                        </div>
                      </Legend>
                      <Field>
                        <Label
                          className='block'
                          htmlFor={`frames.${index}.texts.${textIndex}.content`}
                        >
                          Content
                        </Label>
                        <Input
                          className={`w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                            formik.touched?.frames?.[index]?.texts?.[textIndex]
                              ?.content &&
                            formik.errors?.frames?.[index]?.texts?.[textIndex]
                              ?.content
                              ? 'border-rose-500'
                              : ''
                          }`}
                          id={`frames.${index}.texts.${textIndex}.content`}
                          name={`frames.${index}.texts.${textIndex}.content`}
                          value={text.content}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                        />

                        <ErrorMessage
                          show={
                            formik.touched?.frames?.[index]?.texts?.[textIndex]
                              ?.content &&
                            formik.errors?.frames?.[index]?.texts?.[textIndex]
                              ?.content
                          }
                          message={
                            formik.errors?.frames?.[index]?.texts?.[textIndex]
                              ?.content
                          }
                        />
                      </Field>
                      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                        <Field>
                          <Label
                            className='block'
                            htmlFor={`frames.${index}.texts.${textIndex}.x`}
                          >
                            X-axis position
                          </Label>
                          <Input
                            type='number'
                            name={`frames.${index}.texts.${textIndex}.x`}
                            className={`w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                              formik.touched?.frames?.[index]?.texts?.[
                                textIndex
                              ]?.x &&
                              formik.errors?.frames?.[index]?.texts?.[textIndex]
                                ?.x
                                ? 'border-rose-500'
                                : ''
                            }`}
                            id={`frames.${index}.texts.${textIndex}.x`}
                            value={text.x}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          />

                          <ErrorMessage
                            show={
                              formik.touched?.frames?.[index]?.texts?.[
                                textIndex
                              ]?.x &&
                              formik.errors?.frames?.[index]?.texts?.[textIndex]
                                ?.x
                            }
                            message={
                              formik.errors?.frames?.[index]?.texts?.[textIndex]
                                ?.x
                            }
                          />
                        </Field>

                        <Field>
                          <Label
                            className='block'
                            htmlFor={`frames.${index}.texts.${textIndex}.y`}
                          >
                            Y-axis position
                          </Label>
                          <Input
                            type='number'
                            name={`frames.${index}.texts.${textIndex}.y`}
                            className={`w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                              formik.touched?.frames?.[index]?.texts?.[
                                textIndex
                              ]?.y &&
                              formik.errors?.frames?.[index]?.texts?.[textIndex]
                                ?.y
                                ? 'border-rose-500'
                                : ''
                            }`}
                            id={`frames.${index}.texts.${textIndex}.y`}
                            value={text.y}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          />

                          <ErrorMessage
                            show={
                              formik.touched?.frames?.[index]?.texts?.[
                                textIndex
                              ]?.y &&
                              formik.errors?.frames?.[index]?.texts?.[textIndex]
                                ?.y
                            }
                            message={
                              formik.errors?.frames?.[index]?.texts?.[textIndex]
                                ?.y
                            }
                          />
                        </Field>

                        <Field>
                          <Label
                            className='block'
                            htmlFor={`frames.${index}.texts.${textIndex}.size`}
                          >
                            Font size
                          </Label>
                          <Input
                            type='number'
                            className={`w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                              formik.touched?.frames?.[index]?.texts?.[
                                textIndex
                              ]?.size &&
                              formik.errors?.frames?.[index]?.texts?.[textIndex]
                                ?.size
                                ? 'border-rose-500'
                                : ''
                            }`}
                            id={`frames.${index}.texts.${textIndex}.size`}
                            name={`frames.${index}.texts.${textIndex}.size`}
                            value={text.size}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          />

                          <ErrorMessage
                            show={
                              formik.touched?.frames?.[index]?.texts?.[
                                textIndex
                              ]?.size &&
                              formik.errors?.frames?.[index]?.texts?.[textIndex]
                                ?.size
                            }
                            message={
                              formik.errors?.frames?.[index]?.texts?.[textIndex]
                                ?.size
                            }
                          />
                        </Field>

                        <Color
                          id={`frames.${index}.texts.${textIndex}.color`}
                          name={`frames.${index}.texts.${textIndex}.color`}
                          label={'Font color'}
                          value={text.color}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          error={
                            formik.touched?.frames?.[index]?.texts?.[textIndex]
                              ?.color &&
                            formik.errors?.frames?.[index]?.texts?.[textIndex]
                              ?.color
                          }
                        />

                        <ErrorMessage
                          show={
                            formik.touched?.frames?.[index]?.texts?.[textIndex]
                              ?.color &&
                            formik.errors?.frames?.[index]?.texts?.[textIndex]
                              ?.color
                          }
                          message={
                            formik.errors?.frames?.[index]?.texts?.[textIndex]
                              ?.color
                          }
                        />
                      </div>
                    </Fieldset>
                  ))}
                </TabPanel>
                <TabPanel className='rounded-xl bg-white/5 p-3'>
                  <Field className='flex flex-row justify-start items-center gap-2'>
                    <Switch
                      id={`frames.${index}.includeImage`}
                      name={`frames.${index}.includeImage`}
                      checked={frame.includeImage}
                      onChange={(checked) =>
                        formik.setFieldValue(
                          `frames.${index}.includeImage`,
                          checked
                        )
                      }
                      onBlur={formik.handleBlur}
                      className='group relative flex h-7 w-14 cursor-pointer rounded-full bg-[#e5e5e5] p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#6A64F1]'
                    >
                      <span
                        aria-hidden='true'
                        className='pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7'
                      />
                    </Switch>
                    <Label htmlFor={`frames.${index}.includeImage`}>
                      Include image
                    </Label>
                  </Field>

                  {frame.includeImage &&
                    frame.images.map((image, imageIndex) => (
                      <Fieldset
                        className='space-y-4 mt-2 border-t-2 border-b-2 border-gray-300 py-4'
                        key={`frames-${index}-image-${imageIndex}`}
                      >
                        <Legend className='text-lg font-bold flex justify-between items-center'>
                          <span className='block'>{`Image ${
                            imageIndex + 1
                          }`}</span>
                          <div className='flex justify-center items-center gap-2'>
                            {imageIndex === 0 && (
                              <Button
                                onClick={() => addImage(index)}
                                title='Add image'
                                className={
                                  'hover:bg-[#6A64F1]/90 rounded-md bg-[#6A64F1] p-2 text-center text-base font-semibold text-white outline-none'
                                }
                              >
                                <FaPlus />
                              </Button>
                            )}
                            {frame.images.length > 1 && (
                              <Button
                                title={`Delete Image ${imageIndex + 1}`}
                                className={
                                  'hover:bg-rose-600/90 rounded-md bg-rose-600 p-2 text-center text-base font-semibold text-white outline-none'
                                }
                                onClick={() =>
                                  deleteFor('images', index, imageIndex)
                                }
                              >
                                <FaTrashCan />
                              </Button>
                            )}
                          </div>
                        </Legend>
                        <Field>
                          <Label
                            className='block'
                            htmlFor={`frames.${index}.images.${imageIndex}.url`}
                          >
                            Url
                          </Label>
                          <Input
                            type='url'
                            className={`w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                              formik.touched?.frames?.[index]?.images?.[
                                imageIndex
                              ]?.url &&
                              formik.errors?.frames?.[index]?.images?.[
                                imageIndex
                              ]?.url
                                ? 'border-rose-500'
                                : ''
                            }`}
                            id={`frames.${index}.images.${imageIndex}.url`}
                            name={`frames.${index}.images.${imageIndex}.url`}
                            value={image.url}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          />

                          <ErrorMessage
                            show={
                              formik.touched?.frames?.[index]?.images?.[
                                imageIndex
                              ]?.url &&
                              formik.errors?.frames?.[index]?.images?.[
                                imageIndex
                              ]?.url
                            }
                            message={
                              formik.errors?.frames?.[index]?.images?.[
                                imageIndex
                              ]?.url
                            }
                          />

                          {image.url && (
                            <div className='flex'>
                              <div className='w-[150px] p-2 pl-0'>
                                <img
                                  src={image.url}
                                  alt={`Frame ${index} image ${imageIndex} url`}
                                  className='shadow-md rounded max-w-full h-auto align-middle border-none'
                                />
                              </div>
                            </div>
                          )}
                        </Field>
                        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                          <Field>
                            <Label
                              className='block'
                              htmlFor={`frames.${index}.images.${imageIndex}.x`}
                            >
                              X-axis position
                            </Label>
                            <Input
                              type='number'
                              className={`w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                                formik.touched?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.x &&
                                formik.errors?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.x
                                  ? 'border-rose-500'
                                  : ''
                              }`}
                              id={`frames.${index}.images.${imageIndex}.x`}
                              name={`frames.${index}.images.${imageIndex}.x`}
                              value={image.x}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />

                            <ErrorMessage
                              show={
                                formik.touched?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.x &&
                                formik.errors?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.x
                              }
                              message={
                                formik.errors?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.x
                              }
                            />
                          </Field>

                          <Field>
                            <Label
                              className='block'
                              htmlFor={`frames.${index}.images.${imageIndex}.y`}
                            >
                              Y-axis position
                            </Label>
                            <Input
                              type='number'
                              className={`w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                                formik.touched?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.y &&
                                formik.errors?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.y
                                  ? 'border-rose-500'
                                  : ''
                              }`}
                              id={`frames.${index}.images.${imageIndex}.y`}
                              name={`frames.${index}.images.${imageIndex}.y`}
                              value={image.y}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />

                            <ErrorMessage
                              show={
                                formik.touched?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.y &&
                                formik.errors?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.y
                              }
                              message={
                                formik.errors?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.y
                              }
                            />
                          </Field>

                          <Field>
                            <Label
                              className='block'
                              htmlFor={`frames.${index}.images.${imageIndex}.width`}
                            >
                              Width
                            </Label>
                            <Input
                              type='number'
                              className={`w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                                formik.touched?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.width &&
                                formik.errors?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.width
                                  ? 'border-rose-500'
                                  : ''
                              }`}
                              id={`frames.${index}.images.${imageIndex}.width`}
                              name={`frames.${index}.images.${imageIndex}.width`}
                              value={image.width}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />

                            <ErrorMessage
                              show={
                                formik.touched?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.width &&
                                formik.errors?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.width
                              }
                              message={
                                formik.errors?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.width
                              }
                            />
                          </Field>

                          <Field>
                            <Label
                              className='block'
                              htmlFor={`frames.${index}.images.${imageIndex}.height`}
                            >
                              Height
                            </Label>
                            <Input
                              type='number'
                              className={`w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                                formik.touched?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.height &&
                                formik.errors?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.height
                                  ? 'border-rose-500'
                                  : ''
                              }`}
                              id={`frames.${index}.images.${imageIndex}.height`}
                              name={`frames.${index}.images.${imageIndex}.height`}
                              value={image.height}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />

                            <ErrorMessage
                              show={
                                formik.touched?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.height &&
                                formik.errors?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.height
                              }
                              message={
                                formik.errors?.frames?.[index]?.images?.[
                                  imageIndex
                                ]?.height
                              }
                            />
                          </Field>
                        </div>
                      </Fieldset>
                    ))}
                </TabPanel>
                <TabPanel className='rounded-xl bg-white/5 p-3'>
                  <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                    <Field>
                      <Label
                        className='block mb-1'
                        htmlFor={`frames.${index}.backgroundType`}
                      >
                        Background type
                      </Label>
                      <Select
                        id={`frames.${index}.backgroundType`}
                        name={`frames.${index}.backgroundType`}
                        value={frame.backgroundType}
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          formik.handleChange(e);

                          if (e.target.value === 'color') {
                            formik.setFieldValue(
                              `frames.${index}.background`,
                              '#000000'
                            );
                          } else {
                            formik.setFieldValue(
                              `frames.${index}.background`,
                              ''
                            );
                          }
                        }}
                        className={`w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 pl-2 text-base font-medium text-[#6B7280] outline-none border-r-8 border-transparent outline outline-[#e0e0e0]/50 ${
                          formik.touched?.frames?.[index]?.backgroundType &&
                          formik.errors?.frames?.[index]?.backgroundType
                            ? 'border-rose-500'
                            : ''
                        }`}
                      >
                        <option
                          value={undefined}
                          className='first-letter:uppercase'
                        >
                          Select type
                        </option>
                        {BACKGROUND_TYPES.map((type, typeIndex) => (
                          <option
                            value={type}
                            key={`frame-${index}-background-type-${typeIndex}`}
                            className='first-letter:uppercase'
                          >
                            {type}
                          </option>
                        ))}
                      </Select>

                      <ErrorMessage
                        show={
                          formik.touched?.frames?.[index]?.backgroundType &&
                          formik.errors?.frames?.[index]?.backgroundType
                        }
                        message={formik.errors?.frames?.[index]?.backgroundType}
                      />
                    </Field>
                    {frame.backgroundType === 'color' ? (
                      <div className='flex flex-col gap-1'>
                        <Color
                          id={`frames.${index}.background`}
                          name={`frames.${index}.background`}
                          label={'Background color'}
                          value={frame.background}
                          onChange={formik.handleChange}
                          error={
                            formik.touched?.frames?.[index]?.background &&
                            formik.errors?.frames?.[index]?.background
                          }
                        />

                        <ErrorMessage
                          show={
                            formik.touched?.frames?.[index]?.background &&
                            formik.errors?.frames?.[index]?.background
                          }
                          message={formik.errors?.frames?.[index]?.background}
                        />
                      </div>
                    ) : (
                      frame.backgroundType && (
                        <Field>
                          <Label
                            className='block'
                            htmlFor={`frames.${index}.background`}
                          >
                            Background image url
                          </Label>
                          <Input
                            type='url'
                            className={`w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                              formik.touched?.frames?.[index]?.background &&
                              formik.errors?.frames?.[index]?.background
                                ? 'border-rose-500'
                                : ''
                            }`}
                            id={`frames.${index}.background`}
                            name={`frames.${index}.background`}
                            value={frame.background}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          />

                          <ErrorMessage
                            show={
                              formik.touched?.frames?.[index]?.background &&
                              formik.errors?.frames?.[index]?.background
                            }
                            message={formik.errors?.frames?.[index]?.background}
                          />

                          {frame.background && (
                            <div className='flex'>
                              <div className='w-[150px] p-2 pl-0'>
                                <img
                                  src={frame.background}
                                  alt={`Frame ${index} background`}
                                  className='shadow-md rounded max-w-full h-auto align-middle border-none'
                                />
                              </div>
                            </div>
                          )}
                        </Field>
                      )
                    )}
                    <Field>
                      <Label
                        className='block'
                        htmlFor={`frames.${index}.audioUrl`}
                      >
                        Audio url [optional]
                      </Label>
                      <Input
                        className={`w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                          formik.touched?.frames?.[index]?.audioUrl &&
                          formik.errors?.frames?.[index]?.audioUrl
                            ? 'border-rose-500'
                            : ''
                        }`}
                        id={`frames.${index}.audioUrl`}
                        name={`frames.${index}.audioUrl`}
                        value={frame.audioUrl}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />

                      <ErrorMessage
                        show={
                          formik.touched?.frames?.[index]?.audioUrl &&
                          formik.errors?.frames?.[index]?.audioUrl
                        }
                        message={formik.errors?.frames?.[index]?.audioUrl}
                      />

                      {frame.audioUrl && (
                        <audio
                          controls
                          className='my-2'
                        >
                          <source
                            src={frame.audioUrl}
                            type='audio/ogg'
                          />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </Field>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        ))}
        <Button
          type='submit'
          className='flex gap-3 items-center ml-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 border-b-violet-700 border-b-4 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg'
        >
          <span>Submit</span>
        </Button>
      </form>
    </div>
  );
};

export default Create;
