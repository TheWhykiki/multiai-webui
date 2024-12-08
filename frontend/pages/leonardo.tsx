import { useState } from 'react';
import Layout from '../components/Layout';
import { generateLeonardoImage } from '../services/api';

export default function Leonardo() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await generateLeonardoImage(prompt);
      setResult(data.result);
    } catch (error) {
      console.error('Error generating Leonardo image:', error);
    }
  };

  return (
    <Layout title="Leonardo">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Image Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={4}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate Image
        </button>
      </form>
      {result && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Generated Image:</h2>
          <img src={result} alt="Generated by Leonardo AI" className="mt-2 max-w-full h-auto rounded-md" />
        </div>
      )}
    </Layout>
  );
}