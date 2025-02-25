import { AboutModalProps } from "../../types";
import { Modal } from "../ui/Modal";

const ASCII_LOGO = `
====================================
=         =========  =====  =====  =
=  ===============    ====   ===   =
=  =========  ===  ==  ===  =   =  =
=  =    ====  ==  ====  ==  == ==  =
=   ===  =======  ====  ==  =====  =
=  =====  ======        ==  =====  =
========  ==  ==  ====  ==  =====  =
=  ====  ===  ==  ====  ==  =====  =
===     ========  ====  ==  =====  =
====================================
`;

export function AboutModal({ show, onClose }: AboutModalProps) {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title="About 5AM Protocol"
      description="Terminal-based morning routine tracker"
    >
      <div className="max-w-2xl">
        <pre
          className="text-center mb-6 text-green-500"
          role="img"
          aria-label="5AM ASCII Art Logo"
        >
          {ASCII_LOGO}
        </pre>

        <div className="space-y-4 text-center">
          <p>
            Track your morning habits and boost your productivity with this
            minimalist tool.
          </p>

          <div className="pt-4 border-t border-green-500/30" role="contentinfo">
            <p className="mb-2">
              <a
                href="https://github.com/sammarxz/5am-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-black rounded"
                aria-label="View project on GitHub"
              >
                GitHub Repository
              </a>
            </p>

            <p>
              Created by{" "}
              <a
                href="https://marxz.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-black rounded"
                aria-label="Visit creator's website"
              >
                @sammarxz
              </a>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
