"use client";

import React, { useEffect, useState } from "react";

type JsonParserProps = {
  jsonData: any;
};

export default function JsonParser({ jsonData }: JsonParserProps) {
  const [keys, setKeys] = useState<string[]>([""]);
  const [results, setResults] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const jsonDataKeys = Object.keys(jsonData);
    if (jsonDataKeys.length > 0) {
      const newKeySet = new Set([...jsonDataKeys]);
      const uniqueKeys = Array.from(newKeySet);
      setKeys(uniqueKeys);
    }
  }, []);

  const handleKeyChange = (index: number, value: string) => {
    const newKeys = [...keys];
    newKeys[index] = value;
    setKeys(newKeys);
  };

  const handleDeleteKey = (index: number) => {
    const newKeys = [...keys];
    if (index > -1 && index < keys.length) {
      newKeys.splice(index, 1);
      setKeys(newKeys);
    }
  };

  const addKeyField = () => {
    setKeys([...keys, ""]);
  };

  const handleSubmit = () => {
    const newResults: { [key: string]: any } = {};
    keys.forEach((key) => {
      if (key in jsonData) {
        newResults[key] = jsonData[key];
      }
    });
    setResults(newResults);
  };

  return (
    <div>
      <input type="text" placeholder="데이터 제목을 입력해주세요." />
      {keys.map((key, index) => (
        <div key={index}>
          <label htmlFor={`key-${index}`}>키 입력:</label>
          <input
            id={`key-${index}`}
            type="text"
            value={key}
            onChange={(e) => handleKeyChange(index, e.target.value)}
          />
          <button onClick={() => handleDeleteKey(index)}>X</button>
        </div>
      ))}
      <button onClick={addKeyField}>키 추가</button>
      <hr />
      <button onClick={handleSubmit}>값 가져오기</button>

      <div>
        <h2>결과:</h2>
        {Object.keys(results).length > 0 ? (
          <ul>
            {Object.entries(results).map(([key, value]) => (
              <li key={key}>
                {key}: {value.toString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>값이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
