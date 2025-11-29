/**
 * MergeConflictModal
 * 
 * Visas när en 409 CONFLICT detekteras vid push till server.
 * Ger användaren val att:
 * - Ladda om från server (förlora lokala ändringar)
 * - Tvinga save (skriv över serverns data)
 * - Avbryt (behåll lokala ändringar, gör inget)
 * 
 * REF: CHANGELOG_2025-11-29.md - Git-liknande Versionering
 */

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  HStack,
  Box,
  Badge,
  Alert,
  AlertIcon,
  Divider,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { WarningTwoIcon, RepeatIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

/**
 * @param {Object} props
 * @param {Object} props.conflictInfo - Conflict data from 409 response
 * @param {Function} props.onReload - Callback to reload from server
 * @param {Function} props.onForceSave - Callback to force save (overwrite server)
 * @param {Function} props.onCancel - Callback to cancel (do nothing)
 */
const MergeConflictModal = ({ conflictInfo, onReload, onForceSave, onCancel }) => {
  if (!conflictInfo) return null;

  const {
    your_version,
    server_version,
    conflicting_slides = [],
    message
  } = conflictInfo;

  return (
    <Modal isOpen={true} onClose={onCancel} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent>
        <ModalHeader>
          <HStack spacing={2}>
            <WarningTwoIcon color="orange.500" boxSize={6} />
            <Text>Konflikt detekterad</Text>
          </HStack>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Text>
                Någon annan har ändrat detta case medan du arbetade.
              </Text>
            </Alert>

            <Box bg="gray.50" p={4} borderRadius="md">
              <HStack justify="space-between" mb={2}>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.500">Din version</Text>
                  <Badge colorScheme="blue" fontSize="lg">v{your_version}</Badge>
                </VStack>
                <Text fontSize="2xl" color="gray.400">→</Text>
                <VStack align="end" spacing={0}>
                  <Text fontSize="sm" color="gray.500">Serverns version</Text>
                  <Badge colorScheme="green" fontSize="lg">v{server_version}</Badge>
                </VStack>
              </HStack>
            </Box>

            {conflicting_slides.length > 0 && (
              <Box>
                <Text fontWeight="semibold" mb={2}>Ändrade slides:</Text>
                <List spacing={2}>
                  {conflicting_slides.map((slide, index) => (
                    <ListItem key={index} fontSize="sm">
                      <ListIcon as={WarningTwoIcon} color="orange.500" />
                      <Text as="span" fontWeight="medium">{slide.slide_id}</Text>
                      <Text as="span" color="gray.500" ml={2}>
                        av {slide.modified_by}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Divider />

            <Text fontWeight="semibold">Vad vill du göra?</Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <VStack spacing={3} width="100%">
            <Button
              leftIcon={<RepeatIcon />}
              colorScheme="blue"
              width="100%"
              onClick={onReload}
            >
              Ladda om från server
              <Text fontSize="xs" ml={2} fontWeight="normal" color="blue.200">
                (förlora mina ändringar)
              </Text>
            </Button>

            <Button
              leftIcon={<CheckIcon />}
              colorScheme="orange"
              variant="outline"
              width="100%"
              onClick={onForceSave}
            >
              Skriv över serverns data
              <Text fontSize="xs" ml={2} fontWeight="normal" color="orange.600">
                (tvinga min version)
              </Text>
            </Button>

            <Button
              leftIcon={<CloseIcon />}
              variant="ghost"
              width="100%"
              onClick={onCancel}
            >
              Avbryt
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MergeConflictModal;
