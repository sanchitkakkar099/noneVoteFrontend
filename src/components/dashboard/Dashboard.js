/* eslint-disable no-unused-vars */
import { Controller, set, useForm } from "react-hook-form";
import React, { useEffect, useReducer, useState } from 'react'
import { Button, Form, FormFeedback, Input, Label, Progress } from 'reactstrap';
import Select from "react-select";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Cookies from "universal-cookie";
import './Dashboard.css'
import { useSelector } from "react-redux";
import { usePostListMutation, usePostCreateMutation } from "../../service";
import dayjs from "dayjs"
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const cookies = new Cookies();

const initialState = [{}];
function reducer(state, action) {
    switch (action.type) {
        case "add":
            return [...state, action.payload];
        case "delete":
            return state.filter((item) => {
                return item.name !== action.payload.name;
            })
        case 'RESET':
            return initialState;
        default:
            throw new Error();
    }
}

function Dashboard() {
    const navigate = useNavigate()

    const [state, dispatch] = useReducer(reducer, initialState);
    const session = useSelector((state) => state?.authState?.session);
    const [reqPostlist, resPostList] = usePostListMutation();
    const [reqPostCreate, resPostCreate] = usePostCreateMutation();
    const [step, setStep] = useState(0);
    const [postData, setPostData] = useState([])
    const [price, setPrice] = useState(0);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
        setValue,
    } = useForm();
    useEffect(() => {
        reqPostlist();
    }, [])

    console.log("session",session);

    useEffect(() => {
        if (resPostList?.isSuccess) {
            console.log("resPostList", resPostList?.data);
            setPostData(resPostList?.data);

        }
    }, [resPostList])

    useEffect(() => {
        if (resPostCreate?.isSuccess) {
            toast.success("Post Created", {
                position: "top-center",
            });
            reqPostlist();
            reset();
            setStep(0)
            dispatch({ type: 'RESET' });
        }
        if (resPostCreate?.isError) {
            console.log("resPostCreate?.isError")
            toast.error("Somethings Went Wrong", {
                position: "top-center",
            });
        }

    }, [resPostCreate])


    const handleAddSubscription = async (e, field) => {
        const data = {
            name: field,
            price: "0"
        }
        if (field === "nonvote") {
            data.price = 2;
        } else if (field === "againstcandidate") {
            data.price = 4;
        }
        else if (field === "againstparty") {
            data.price = 4;
        }
        else if (field === "otherparty") {
            data.price = 4;
        }
        else if (field === "thenews") {
            data.price = 5;
        }
        else if (field === "letteragainstcandidate") {
            data.price = 12;
        }
        else if (field === "letteragainstparty") {
            data.price = 12;
        } else {
            data.price = 0;
        }
        if (e.target.checked) {
            dispatch({ type: "add", payload: data });
        }
        else {
            dispatch({ type: "delete", payload: data });
        }

    }
    useEffect(() => {
        const data = state.reduce((total, item) => {
            if (item.price) {
                return total + item.price;
            }
            return total;
        }, 0);
        setPrice(data)
    }, [state]);

    const step0 = async (state) => {
        console.log("state", state);
        setStep(prev => prev + 1)
    }
    const step1 = async (state) => {
        console.log("state", state);
        setStep(prev => prev + 1)
    }
    const step2 = async (state) => {
        console.log("state", state);
        setStep(prev => prev + 1)
    }
    const step3 = async (state) => {
        console.log("state", state);
        setStep(prev => prev + 1)
    }
    const step4 = async (state) => {
        console.log("state", state);
        setStep(prev => prev + 1)
    }
    const onNext = async (state) => {

        if(!session){
            navigate('/login')
            return;
        }

        const payload = {
            ...state,
            user_id: session?.user?.id,
            NonVoteAgainst: state?.NonVoteAgainst?.value,
            age: state?.age?.value,
            citizenship: state?.citizenship?.value,
            election: state?.election?.value,
            party: state?.party?.value,
            state: state?.state?.value,
        }
        reqPostCreate(payload)
    }
    const handlePrevious = () => {
        setStep(prev => prev - 1)

    }
    return (
        <div className='container d-flex c-main'>
            <div className='c-left'>
                <div className='c-left-upper'>
                    <h1 className="heading-2">Latest Non-Votes:</h1>
                    <div><span class="text-span">What is a non-vote? </span>Not voting is a silent statement, make your non-vote matter by casting it here and let your voice be heard!</div>
                </div>
                <div className='c-left-lower'>
                    <h3 class="heading-3">Recent Non-Votes</h3>
                    <div className="list">
                        {postData.length > 0 && postData.map((data, index) => (
                            <div key={index} className="collection-item">
                                <div className=".text-block-2 ">{data?.name}</div>
                                <div className="w-layout-hflex">
                                    <img src="https://cdn.prod.website-files.com/664b660ab49ac3b4ea02591f/664b9313fec4428029ef6270_664b92dc8220759146f18a45_User-avatar.svg-1.webp" loading="lazy" alt="" className="image" />
                                    <div className="w-layout-vflex">
                                        <div className="text-block">Voting Against {data.NonVoteAgainst}</div>
                                        <div className="text-block-4">{data?.reason}</div>
                                        <div className="w-layout-hflex">
                                            <div className="text-block-3">{dayjs(data?.created_at).format('MMMM D, YYYY')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
            <div className='c-right'>
                <div className='right-code-embed'>
                    <Progress style={{ height: '5px' }} value={17 * (step ? step + 1 : 1)} />
                    <Toaster position="top-center" reverseOrder={false} />
                    {step === 0 &&
                        <Form onSubmit={handleSubmit(step0)}>
                            <div className="m-3">
                                <Label for="election">
                                    Election:
                                </Label>
                                <span className="fillout-required-asterisk" aria-label="Required question" title="Required question" style={{ color: "rgb(248, 113, 113)" }}>*</span>
                                <Controller
                                    id="election"
                                    name="election"
                                    control={control}
                                    rules={{ required: "Field is required" }}
                                    render={({ field }) => (
                                        <Select
                                            className="react-select"
                                            classNamePrefix="select"
                                            {...field}
                                            options={[
                                                { label: "US Presidential Election", value: "US Presidential Election" },
                                                { label: "Testing", value: "Testing" }
                                            ]}
                                        />
                                    )}
                                />
                                {errors.election && (
                                    <FormFeedback>
                                        {errors?.election?.message}
                                    </FormFeedback>
                                )}
                            </div>
                            <div className="m-3">
                                <Label for="Non-Vote Against">
                                    Non-Vote Against:
                                </Label>
                                <span className="fillout-required-asterisk" aria-label="Required question" title="Required question" style={{ color: "rgb(248, 113, 113)" }}>*</span>
                                <Controller
                                    id="NonVoteAgainst"
                                    name="NonVoteAgainst"
                                    control={control}
                                    rules={{ required: "Field is required" }}
                                    render={({ field }) => (
                                        <Select
                                            className="react-select"
                                            classNamePrefix="select"
                                            {...field}
                                            options={[
                                                { label: "Joe Biden", value: "Joe Biden" },
                                                { label: "Donald Trump", value: "Donald Trump" },
                                                { label: "The Election", value: "The Election" },
                                            ]}
                                        />
                                    )}
                                />
                                {errors.NonVoteAgainst && (
                                    <FormFeedback>
                                        {errors?.NonVoteAgainst.message}
                                    </FormFeedback>
                                )}
                            </div>
                            <div className="m-3">
                                <Button type="submit" color="primary" className="w-100">
                                    Next <FaArrowRight />
                                </Button>
                            </div>
                        </Form>
                    }
                    {step === 1 &&
                        <Form onSubmit={handleSubmit(step1)}>
                            <div className="m-3">
                                <spna className="custom-pointer" onClick={handlePrevious}>
                                    <FaArrowLeft />
                                </spna>
                            </div>
                            <div className="m-3">
                                <h2>Voting Against:</h2>
                                <h2>The Election</h2>
                            </div>
                            <div className="m-3">
                                <Label className="form-label" for="reason">
                                    Reason
                                </Label>
                                <span className="fillout-required-asterisk" aria-label="Required question" title="Required question" style={{ color: "rgb(248, 113, 113)" }}>*</span>
                                <Controller
                                    id="reason"
                                    name="reason"
                                    control={control}
                                    rules={{ required: "Reason is required" }}
                                    render={({ field }) => (
                                        <Input
                                            placeholder="Enter Reason"
                                            className="form-control"
                                            {...field}
                                            type="textarea"
                                        />
                                    )}
                                />
                                {errors.reason && (
                                    <FormFeedback>
                                        {errors?.reason?.message}
                                    </FormFeedback>
                                )}
                            </div>
                            <div className="m-3">
                                <Label className="form-label" for="name">
                                    Name
                                </Label>
                                <span className="fillout-required-asterisk" aria-label="Required question" title="Required question" style={{ color: "rgb(248, 113, 113)" }}>*</span>
                                <Controller
                                    id="name"
                                    name="name"
                                    control={control}
                                    rules={{ required: "Name is required" }}
                                    render={({ field }) => (
                                        <Input
                                            placeholder="Enter Name"
                                            className="form-control"
                                            {...field}
                                            type="text"
                                        />
                                    )}
                                />
                                {errors.name && (
                                    <FormFeedback>
                                        {errors?.name?.message}
                                    </FormFeedback>
                                )}
                            </div>
                            <div className="m-3">
                                <Label className="form-label" for="email">
                                    Email
                                </Label>
                                <span className="fillout-required-asterisk" aria-label="Required question" title="Required question" style={{ color: "rgb(248, 113, 113)" }}>*</span>

                                <Controller
                                    id="email"
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: "Email is required",
                                        validate: {
                                            matchPattern: (v) =>
                                                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(
                                                    v
                                                ) ||
                                                "Email address must be a valid address",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            placeholder="Enter Email"
                                            className="form-control"
                                            {...field}
                                            type="text"
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <FormFeedback>
                                        {errors?.email?.message}
                                    </FormFeedback>
                                )}
                            </div>
                            <div className="m-3 mb-4">
                                <Button type="submit" color="primary" className="w-100">
                                    Be heard <FaArrowRight />
                                </Button>
                            </div>
                        </Form>
                    }
                    {step === 2 &&
                        <Form onSubmit={handleSubmit(step2)}>
                            <div className="m-3">
                                <spna className="custom-pointer" onClick={handlePrevious}>
                                    <FaArrowLeft />
                                </spna>
                            </div>
                            <div className="m-3">
                                <h2>Voting Against:</h2>
                                <h2>The Election</h2>
                            </div>
                            <div className="m-3">

                            </div>
                            <div className="m-3 font-weight-bold">
                                Type your question here
                                <div className="m-1 ms-0">
                                    <Input
                                        id="castvote"
                                        name="castvote"
                                        className="me-2"
                                        checked={state.some(item => item.name === "castvote")}
                                        type="checkbox"
                                        onClick={(e) => handleAddSubscription(e, "castvote")}
                                    />
                                    <Label className="form-label" for="castvote">
                                        Cast Vote [FREE]
                                    </Label>
                                </div>
                                <div className="m-1 ms-0">
                                    <Input
                                        id="nonvote"
                                        name="nonvote"
                                        className="me-2"
                                        checked={state.some(item => item.name === "nonvote")}
                                        type="checkbox"
                                        onClick={(e) => handleAddSubscription(e, "nonvote")}
                                    />
                                    <Label className="form-label" for="nonvote">
                                        Post it to Non-Vote.com [$2]
                                    </Label>
                                </div>
                                <div className="m-1 ms-0">
                                    <Input
                                        id="againstcandidate"
                                        name="againstcandidate"
                                        className="me-2"
                                        checked={state.some(item => item.name === "againstcandidate")}
                                        type="checkbox"
                                        onClick={(e) => handleAddSubscription(e, "againstcandidate")}
                                    />
                                    <Label className="form-label" for="againstcandidate">
                                        Email it: Against Candidate [$4]
                                    </Label>
                                </div>
                                <div className="m-1 ms-0">
                                    <Input
                                        id="againstparty"
                                        name="againstparty"
                                        className="me-2"
                                        checked={state.some(item => item.name === "againstparty")}
                                        type="checkbox"
                                        onClick={(e) => handleAddSubscription(e, "againstparty")}
                                    />
                                    <Label className="form-label" for="againstparty">
                                        Email it: Against Party [$4]
                                    </Label>
                                </div>
                                <div className="m-1 ms-0">
                                    <Input
                                        id="otherparty"
                                        name="otherparty"
                                        className="me-2"
                                        checked={state.some(item => item.name === "otherparty")}
                                        type="checkbox"
                                        onClick={(e) => handleAddSubscription(e, "otherparty")}
                                    />
                                    <Label className="form-label" for="otherparty">
                                        Email it: Other Party [$4]
                                    </Label>
                                </div>
                                <div className="m-1 ms-0">
                                    <Input
                                        id="thenews"
                                        name="thenews"
                                        className="me-2"
                                        checked={state.some(item => item.name === "thenews")}
                                        type="checkbox"
                                        onClick={(e) => handleAddSubscription(e, "thenews")}
                                    />
                                    <Label className="form-label" for="thenews">
                                        Email it: The News [$5]
                                    </Label>
                                </div>
                                <div className="m-1 ms-0">
                                    <Input
                                        id="letteragainstcandidate"
                                        name="letteragainstcandidate"
                                        className="me-2"
                                        checked={state.some(item => item.name === "letteragainstcandidate")}
                                        type="checkbox"
                                        onClick={(e) => handleAddSubscription(e, "letteragainstcandidate")}

                                    />
                                    <Label className="form-label" for="letteragainstcandidate">
                                        Send a Letter: Against Candidate [$12]
                                    </Label>
                                </div>
                                <div className="m-1 ms-0">
                                    <Input
                                        id="letteragainstparty"
                                        name="letteragainstparty"
                                        className="me-2"
                                        checked={state.some(item => item.name === "letteragainstparty")}
                                        type="checkbox"
                                        onClick={(e) => handleAddSubscription(e, "letteragainstparty")}
                                    />
                                    <Label className="form-label" for="letteragainstparty">
                                        Send a Letter: Against Party [$12]
                                    </Label>
                                </div>
                            </div>

                            <div className="m-3 mb-4">
                                <Button type="submit" color="primary" className="w-100">
                                    {`$${price}`} Next <FaArrowRight />
                                </Button>
                            </div>
                        </Form>
                    }
                    {step === 3 &&
                        <Form onSubmit={handleSubmit(step3)}>
                            <div className="m-3">
                                <spna className="custom-pointer" onClick={handlePrevious}>
                                    <FaArrowLeft />
                                </spna>
                            </div>
                            <div className="m-3">
                                <h2>This is where you would pay based on your selected actions.</h2>
                            </div>
                            <div className="d-flex justify-content-center">
                                💰💰💰 {`$${price}`} 💰💰💰
                            </div>
                            <div className="m-3 mb-4">
                                <Button type="submit" color="primary" className="w-100">
                                    It's free is test mode... <FaArrowRight />
                                </Button>
                            </div>
                        </Form>
                    }
                    {step === 4 &&
                        <Form onSubmit={handleSubmit(step4)}>
                            <div className="m-3">
                                <spna className="custom-pointer" onClick={handlePrevious}>
                                    <FaArrowLeft />
                                </spna>
                            </div>
                            <div className="m-3">
                                <Label for="citizenship">
                                    Citizenship
                                </Label>
                                <Controller
                                    id="citizenship"
                                    name="citizenship"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            className="react-select"
                                            classNamePrefix="select"
                                            {...field}
                                            options={[
                                                { label: "US Citizen", value: "US Citizen" },
                                                { label: "Non-US Citizen", value: "Non-US Citizen" }
                                            ]}
                                        />
                                    )}
                                />
                                {errors.citizenship && (
                                    <FormFeedback>
                                        {errors?.citizenship?.message}
                                    </FormFeedback>
                                )}
                            </div>
                            <div className="m-3">
                                <Label for="state">
                                    State
                                </Label>
                                <Controller
                                    id="state"
                                    name="state"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            className="react-select"
                                            classNamePrefix="select"
                                            {...field}
                                            options={[
                                                { label: "Alabama", value: "Alabama" },
                                                { label: "Alaska", value: "Alaska" },
                                                { label: "Arizona", value: "Arizona" },
                                                { label: "Arkansas", value: "Arkansas" },
                                                { label: "California", value: "California" },
                                                { label: "Connecticut", value: "Connecticut" },
                                                { label: "Illinois", value: "Illinois" },
                                                { label: "Indiana", value: "Indiana" },
                                                { label: "Iowa", value: "Iowa" },
                                                { label: "Kansas", value: "Kansas" },
                                                { label: "Kentucky", value: "Kentucky" },
                                                { label: "Louisiana", value: "Louisiana" },
                                                { label: "Maine", value: "Maine" },
                                                { label: "Maryland", value: "Maryland" },
                                                { label: "Massachusetts", value: "Massachusetts" },


                                            ]}
                                        />
                                    )}
                                />
                                {errors.state && (
                                    <FormFeedback>
                                        {errors?.state?.message}
                                    </FormFeedback>
                                )}
                            </div>
                            <div className="m-3 mb-4">
                                <Button type="submit" color="primary" className="w-100">
                                    Next <FaArrowRight />
                                </Button>
                            </div>
                        </Form>
                    }
                    {step === 5 &&
                        <Form onSubmit={handleSubmit(onNext)}>
                            <div className="m-3">
                                <spna className="custom-pointer" onClick={handlePrevious}>
                                    <FaArrowLeft />
                                </spna>
                            </div>
                            <div className="m-3">
                                <Label for="party">
                                    Party
                                </Label>
                                <Controller
                                    id="party"
                                    name="party"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            className="react-select"
                                            classNamePrefix="select"
                                            {...field}
                                            options={[
                                                { label: "Registered Republican", value: "Registered Republican" },
                                                { label: "Registered Democrat", value: "Registered Democrat" },
                                                { label: "Independent", value: "Independent" },
                                                { label: "Not eligible to vote", value: "Not eligible to vote" },
                                                { label: "Prefer not to say", value: "Prefer not to say" },
                                                { label: "Other", value: "Other" },
                                            ]}
                                        />
                                    )}
                                />
                                {errors.party && (
                                    <FormFeedback>
                                        {errors?.party?.message}
                                    </FormFeedback>
                                )}
                            </div>
                            <div className="m-3">
                                <Label for="age">
                                    Age Range
                                </Label>
                                <Controller
                                    id="age"
                                    name="age"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            className="react-select"
                                            classNamePrefix="select"
                                            {...field}
                                            options={[
                                                { label: "Under 18", value: "Under 18" },
                                                { label: "18 - 25", value: "18 - 25" },
                                                { label: "26 - 35", value: "26 - 35" },
                                                { label: "36 - 50", value: "36 - 50" },
                                                { label: "51 - 65", value: "51 - 65" },
                                                { label: "65+", value: "65+" },
                                                { label: "Prefer not to say", value: "Prefer not to say" },
                                            ]}
                                        />
                                    )}
                                />
                                {errors.age && (
                                    <FormFeedback>
                                        {errors?.age?.message}
                                    </FormFeedback>
                                )}
                            </div>
                            <div className="m-3 mb-4">
                                <Button type="submit" color="primary" className="w-100">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    }

                </div>
            </div>
        </div>
    )
}

export default Dashboard
