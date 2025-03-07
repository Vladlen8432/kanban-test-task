import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { RootState } from "../redux/store";
import { api } from "../services/api";
import { setIssue, moveIssue, BoardState } from "../redux/boardSlice";
import { useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, ListGroup } from "react-bootstrap";

const Issues = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { todo, inProgress, done } = useSelector(
    (state: RootState) => state.board
  );

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="d-flex justify-content-around">
        {["todo", "inProgress", "done"].map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided) => (
              <Card
                className="col-3"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Card.Header>
                  <h5>{column.toUpperCase()}</h5>
                </Card.Header>
                <ListGroup variant="flush">
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
  );
};

export default Issues;
