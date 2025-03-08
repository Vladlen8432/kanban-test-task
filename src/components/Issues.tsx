import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { RootState } from "../redux/store";
import { api } from "../services/api";
import { setIssue, moveIssue, BoardState, Issue } from "../redux/boardSlice";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Button, Card, Form, ListGroup } from "react-bootstrap";
import "./styles.css";

const Issues = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { todo, inProgress, done } = useSelector(
    (state: RootState) => state.board
  );

  const [newIssue, setNewIssue] = useState("");

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch(
      moveIssue({
        id: parseInt(draggableId),
        from: source.droppableId as keyof BoardState,
        to: destination.droppableId as keyof BoardState,
      })
    );
  };

  useEffect(() => {
    dispatch(api())
      .then((data) => {
        if (api.fulfilled.match(data)) {
          dispatch(setIssue(data.payload));
        }
      })
      .catch((error) => console.error("Failed to fetch issues:", error));
  }, [dispatch]);

  const handleAddIssue = () => {
    if (!newIssue.trim()) return;

    const newTask: Issue = {
      id: Date.now(),
      title: newIssue,
      state: "open",
      assignee: null,
      url: "",
    };

    dispatch(setIssue([newTask]));
    setNewIssue("");
  };

  return (
    <div className="container">
      <Form className="mb-3 d-flex">
        <Form.Control
          type="text"
          placeholder="Enter new issue"
          value={newIssue}
          onChange={(e) => setNewIssue(e.target.value)}
        />
        <Button variant="primary" onClick={handleAddIssue} className="ms-2">
          Load Issue
        </Button>
      </Form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="d-flex justify-content-between">
          {["todo", "inProgress", "done"].map((column) => (
            <Droppable key={column} droppableId={column}>
              {(provided) => (
                <Card
                  className="col-3"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Card.Header className="issueHeader">
                    <h5>{column.toUpperCase()}</h5>
                  </Card.Header>
                  <ListGroup variant="flush" className="issueList">
                    {column === "todo" &&
                      todo.map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <ListGroup.Item
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {issue.title}
                            </ListGroup.Item>
                          )}
                        </Draggable>
                      ))}
                    {column === "inProgress" &&
                      inProgress.map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <ListGroup.Item
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {issue.title}
                            </ListGroup.Item>
                          )}
                        </Draggable>
                      ))}
                    {column === "done" &&
                      done.map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <ListGroup.Item
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {issue.title}
                            </ListGroup.Item>
                          )}
                        </Draggable>
                      ))}
                  </ListGroup>
                  {provided.placeholder}
                </Card>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Issues;
