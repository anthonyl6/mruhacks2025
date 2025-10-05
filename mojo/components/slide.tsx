import { useState, useRef } from 'react';
import React from 'react';  // Add this line for React.Children
import {
  View,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native';

// A reusable horizontal scroller that snaps to each child
export function HorizontalSideScroll({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  // Handler to record each child’s measured width
  const onChildLayout = (index: number) => (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    setItemWidths((prev) => {
      const next = [...prev];
      next[index] = width;
      return next;
    });
  };

  // Compute cumulative offsets for snapping
  const snapOffsets = itemWidths.reduce<number[]>(
    (offsets, w, i) => {
      const prev = offsets[i - 1] ?? 0;
      offsets.push(prev + w);
      return offsets;
    },
    []
  );

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToOffsets={snapOffsets}
      snapToAlignment="start"
      contentContainerClassName="px-2"  
    >
      {React.Children.map(children, (child, idx) => (
        <View onLayout={onChildLayout(idx)} key={idx}>
          {child}
        </View>
      ))}
    </ScrollView>
  );
}
